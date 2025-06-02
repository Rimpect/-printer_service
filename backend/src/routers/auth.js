import { Router } from 'express';
import { login, refreshToken } from '../controllers/auth.js';

const router = Router();

router.post('/login', login);
router.post('/refresh-token', refreshToken);  // Теперь метод существует!


export default router;