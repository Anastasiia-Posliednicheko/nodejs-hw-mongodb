import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';



export const register = async (payload) => {
  const { name, email, password } = payload;

  const existingUser = await User.findOne({ email: payload.email });
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


  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const isPasswordCorrect = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Unauthorized');
  }
  await Session.findOneAndDelete({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return { accessToken, refreshToken };
};
