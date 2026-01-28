import prisma from '../utils/prisma';
import { UpdateUserRoleDTO } from '../dtos/user.dto';

export class UserService {
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    return user;
  }

  async updateUserRole(id: string, data: UpdateUserRoleDTO) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { role: data.role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw { statusCode: 404, message: 'User not found' };
      }
      throw error;
    }
  }
}
