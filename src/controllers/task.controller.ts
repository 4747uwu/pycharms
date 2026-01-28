import { FastifyRequest, FastifyReply } from 'fastify';
import { TaskService } from '../services/task.service';
import { CreateTaskDTO, UpdateTaskStatusDTO } from '../dtos/task.dto';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const taskService = new TaskService();

export class TaskController {
  async createTask(request: AuthenticatedRequest & FastifyRequest<{ Body: CreateTaskDTO }>, reply: FastifyReply) {
    try {
      const task = await taskService.createTask(request.body);
      return reply.status(201).send(task);
    } catch (error: any) {
      if (error.statusCode) {
        return reply.status(error.statusCode).send({
          statusCode: error.statusCode,
          error: error.statusCode === 404 ? 'Not Found' : 'Bad Request',
          message: error.message,
        });
      }
      throw error;
    }
  }

  async getAllTasks(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const tasks = await taskService.getAllTasks(request.user!.userId, request.user!.role);
      return reply.status(200).send(tasks);
    } catch (error: any) {
      throw error;
    }
  }

  async updateTaskStatus(
    request: AuthenticatedRequest & FastifyRequest<{ Params: { id: string }; Body: UpdateTaskStatusDTO }>,
    reply: FastifyReply
  ) {
    try {
      const task = await taskService.updateTaskStatus(
        request.params.id,
        request.body,
        request.user!.userId,
        request.user!.role
      );
      return reply.status(200).send(task);
    } catch (error: any) {
      if (error.statusCode) {
        return reply.status(error.statusCode).send({
          statusCode: error.statusCode,
          error: error.statusCode === 403 ? 'Forbidden' : 'Not Found',
          message: error.message,
        });
      }
      throw error;
    }
  }
}
