import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new AuthController();

router.post('/login', (req, res) => controller.login(req as any, res));
router.post('/register', (req, res) => controller.register(req as any, res));

export default router;