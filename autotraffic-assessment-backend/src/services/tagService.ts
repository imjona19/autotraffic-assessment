import { prisma } from '../config/prisma.js';

export class TagService {
  async getTagsByUser(userId: number) {
    return await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    });
  }

  async createTag(data: { name: string; color?: string; userId: number }) {
    return await prisma.tag.create({
      data: {
        name: data.name,
        color: data.color || '#254bdc',
        userId: data.userId
      }
    });
  }

  async deleteTag(id: number, userId: number) {
    const tag = await prisma.tag.findFirst({ where: { id, userId } });
    if (!tag) {
      throw new Error('Etiqueta no encontrada o no pertenece al usuario');
    }
    return await prisma.tag.delete({ where: { id } });
  }
}