import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/sendMail.js';
import { getEnvVar } from '../utils/getEnvVar.js';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';

export const register = async (payload) => {
  const { name, email, password } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword;
};

export const loginUser = async (payload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.findOneAndDelete({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return session;
};


const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};


export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
   await Session.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    }
  );
  const resetLink = `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`;
  try {
    await sendMail({
      from: getEnvVar('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html: `
        <p>Hello,</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 5 minutes.</p>
      `,
    });
  } catch (err) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};
export const resetPasswordService = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, getEnvVar("JWT_SECRET"));
  } catch (err) {
    throw createHttpError(401, "Token is expired or invalid.");
  }
  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, "User not found!");
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await User.updateOne(
    { _id: user._id },
    {
      $set: { password: encryptedPassword, sessionId: null },
    }
  );
};

