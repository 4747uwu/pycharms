import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service';
import { UpdateUserRoleDTO } from '../dtos/user.dto';

const userService = new UserService();

export class UserController {
  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await userService.getAllUsers();
      return reply.status(200).send(users);
    } catch (error: any) {
      throw error;
    }
  }

  async getUserById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const user = await userService.getUserById(request.params.id);
      return reply.status(200).send(user);
    } catch (error: any) {
      if (error.statusCode) {
        return reply.status(error.statusCode).send({
          statusCode: error.statusCode,
          error: 'Not Found',
          message: error.message,
        });
      }
      throw error;
    }
  }

  async updateUserRole(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserRoleDTO }>,
    reply: FastifyReply
  ) {
    try {
      const user = await userService.updateUserRole(request.params.id, request.body);
      return reply.status(200).send(user);
    } catch (error: any) {
      if (error.statusCode) {
        return reply.status(error.statusCode).send({
          statusCode: error.statusCode,
          error: 'Not Found',
          message: error.message,
        });
      }
      throw error;
    }
  }
}
