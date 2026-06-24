import { prisma } from '../config/prisma.js';

export class TaskService {
  // Obtener todas las tareas de un usuario
  async getTasksByUser(userId: number) {
    return await prisma.task.findMany({
      where: { userId, active: true },
      orderBy: { created_at: 'desc' }
    });
  }

  // Crear una nueva tarea
  async createTask(data: { title: string; description?: string; userId: number }) {
    return await prisma.task.create({
      data: {
        title: data.title,
        ...(data.description !== undefined && { description: data.description }),
        userId: data.userId,
        completed: false
      }
    });
  }

  // Actualizar tarea
  async updateTask(id: number, userId: number, data: { title?: string; description?: string; completed?: boolean }) {

    const task = await prisma.task.findFirst({ where: { id, userId, active: true } });

    if (!task) {
      throw new Error('Tarea no encontrada o no pertenece al usuario');
    }

    return await prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.completed !== undefined && { completed: data.completed }),
      }
    });
  }

  // Eliminar tarea
  async deleteTask(id: number, userId: number) {
    const task = await prisma.task.findFirst({ where: { id, userId, active: true } });

    if (!task) {
      throw new Error('Tarea no encontrada o no pertenece al usuario');
    }

    return await prisma.task.delete({ where: { id } });
  }
}