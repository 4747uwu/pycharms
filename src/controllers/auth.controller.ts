import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, LoginDTO } from '../dtos/auth.dto';

const authService = new AuthService();

export class AuthController {
  async register(request: FastifyRequest<{ Body: RegisterDTO }>, reply: FastifyReply) {
    try {
      const user = await authService.register(request.body);
      return reply.status(201).send(user);
    } catch (error: any) {
      if (error.statusCode) {
        return reply.status(error.statusCode).send({
          statusCode: error.statusCode,
          error: error.statusCode === 409 ? 'Conflict' : 'Error',
          message: error.message,
        });
      }
      throw error;
    }
  }

  async login(request: FastifyRequest<{ Body: LoginDTO }>, reply: FastifyReply) {
    try {
      const result = await authService.login(request.body);
      return reply.status(200).send(result);
    } catch (error: any) {
      if (error.statusCode) {
        return reply.status(error.statusCode).send({
          statusCode: error.statusCode,
          error: 'Unauthorized',
          message: error.message,
        });
      }
      throw error;
    }
  }
}
