import { Router } from 'express';
import { loginController, registerController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/authSchemas.js';

const router = Router();

router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);

export default router;
