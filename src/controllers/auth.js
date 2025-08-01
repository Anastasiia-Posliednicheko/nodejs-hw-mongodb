import { ONE_DAY } from '../constants/index.js';
import { register, loginUser, logoutUser, requestResetToken, resetPasswordService, refreshUsersSession } from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const registerController = async (req, res, next) => {
  try {
    const newUser = await register(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    setupSession(res, session);

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const refreshUserSessionController = async (req, res, next) => {
  try {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
export const requestResetEmailController = async (req, res, next) => {
  try {
    await requestResetToken(req.body.email);

    res.status(200).json({
      status: 200,
      message: 'Reset password email was successfully sent!',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPasswordService(token, password);

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

