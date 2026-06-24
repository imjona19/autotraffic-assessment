import { prisma } from '../config/prisma.js';

export class TaskService {

  async createTask(data: { title: string; description?: string; userId: number; tagIds?: number[] }) {
    const maxOrder = await prisma.task.aggregate({
      where: { userId: data.userId },
      _max: { order: true }
    });

    return await prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        userId: data.userId,
        completed: false,
        order: (maxOrder._max.order ?? -1) + 1,
        ...(data.tagIds && { tags: { connect: data.tagIds.map((id) => ({ id })) } })
      },
      include: { tags: true }
    });
  }

  async updateTask(id: number, userId: number, data: { title?: string; description?: string; completed?: boolean; tagIds?: number[] }) {
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
        ...(data.tagIds && { tags: { set: data.tagIds.map((tagId) => ({ id: tagId })) } })
      },
      include: { tags: true }
    });
  }

  async getTasksByUser(userId: number) {
    return await prisma.task.findMany({
      where: { userId, active: true },
      orderBy: { order: 'asc' },
      include: { tags: true }
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

  async reorderTasks(userId: number, orderedIds: number[]) {
    
    const tasks = await prisma.task.findMany({
      where: { id: { in: orderedIds }, userId, active: true }
    });

    if (tasks.length !== orderedIds.length) {
      throw new Error('Una o más tareas no pertenecen al usuario');
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.task.update({ where: { id }, data: { order: index } })
      )
    );
  }
}