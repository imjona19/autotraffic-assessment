import type { Response } from 'express';
import { TaskService } from '../services/taskService.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const taskService = new TaskService();

export class TaskController {
  
    // GET /api/tasks
    async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.userId!;
            const sortOrder = req.query.sort === 'asc' ? 'asc' : 'desc';

            const tasks = await taskService.getTasksByUser(userId, sortOrder);

            res.status(200).json(tasks);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al obtener las tareas', error });
        }
    }

    // POST /api/tasks
    async create(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { title, description } = req.body;
            const userId = req.userId!;

            if (!title) {
                res.status(400).json({ message: 'El título es obligatorio' });
                return;
            }

            const newTask = await taskService.createTask({ title, description, userId });
            
            res.status(201).json(newTask);
        } 
        catch (error) {
            res.status(500).json({ message: 'Error al crear la tarea', error });
        }
    }

    // PUT /api/tasks/:id
    async update(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { title, description, completed } = req.body;
            const userId = req.userId!;

            if (title === undefined && description === undefined && completed === undefined) {
                res.status(400).json({ message: 'Proporciona al menos un campo para actualizar' });
                return;
            }

            if(req.userId == null || req.userId == undefined) {
                return;
            }

            const updatedTask = await taskService.updateTask(Number(id), Number(userId), {
                title,
                description,
                completed
            });
        
            res.status(200).json(updatedTask);
        } 
        catch (error) {
            res.status(500).json({ message: 'Error al actualizar la tarea', error });
        }
    }

    // DELETE /api/tasks/:id
    async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.userId!;

            await taskService.deleteTask(Number(id), Number(userId));
            
            res.status(200).json({ message: 'Tarea eliminada correctamente' });
        } 
        catch (error) {
            res.status(500).json({ message: 'Error al eliminar la tarea', error });
        }
    }
}