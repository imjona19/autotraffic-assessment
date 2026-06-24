import { Router } from 'express';
import { TaskController } from '../controllers/taskController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
const controller = new TaskController();

router.get('/', verifyToken, (req, res) => controller.getAll(req as any, res));
router.post('/', verifyToken, (req, res) => controller.create(req as any, res));
router.put('/:id', verifyToken, (req, res) => controller.update(req as any, res));
router.delete('/:id', verifyToken, (req, res) => controller.delete(req as any, res));

export default router;