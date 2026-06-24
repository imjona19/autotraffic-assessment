import { prisma } from '../config/prisma.js';
import bcrypt from 'bcrypt';

export class UserService {

  // Crear un nuevo usuario
  async createUser(data: { name: string; email: string; password: string; }) {

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword
      }
    });
  }

  // Editar un usuario
  async updateUser(id: number, data: { name?: string; email?: string; password?: string }) {
    const dataToUpdate: any = { ...data };

    if (data.password) {
      dataToUpdate.password = await bcrypt.hash(data.password, 10);
    }

    return await prisma.user.update({
      where: { id },
      data: dataToUpdate
    });
  }

  // Eliminar un usuario
  async deleteUsuario(id: number) {
    return await prisma.task.delete({
      where: { id }
    });
  }
}