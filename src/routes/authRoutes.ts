import express from 'express';
import { register, login } from '../controllers/authController';

const router = express();

router.post('/register', register);
router.post('/login', login);

export default router;