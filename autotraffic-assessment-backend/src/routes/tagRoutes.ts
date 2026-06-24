import { Router } from 'express';
import { TagController } from '../controllers/tagController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new TagController();

router.get('/', verifyToken, (req, res) => controller.getAll(req as any, res));
router.post('/', verifyToken, (req, res) => controller.create(req as any, res));
router.delete('/:id', verifyToken, (req, res) => controller.delete(req as any, res));

export default router;