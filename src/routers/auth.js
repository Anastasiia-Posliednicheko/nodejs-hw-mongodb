import { Router } from 'express';
import { loginController, registerController,refreshUserSessionController,requestResetEmailController, resetPasswordController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, requestResetEmailSchema, resetPasswordSchema } from '../validation/authSchemas.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { logoutUserController } from '../controllers/auth.js';

const router = Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));
router.post("/reset-pwd", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));



export default router;
