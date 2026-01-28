import { FastifyInstance } from 'fastify';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createTaskSchema, updateTaskStatusSchema, CreateTaskDTO, UpdateTaskStatusDTO } from '../dtos/task.dto';

const taskController = new TaskController();

export async function taskRoutes(server: FastifyInstance) {
  // POST /tasks - Create task (Admin only)
  server.post<{ Body: CreateTaskDTO }>(
    '/tasks',
    {
      preHandler: [authenticate, requireRole('ADMIN'), validateBody(createTaskSchema)],
      schema: {
        tags: ['Tasks'],
        description: 'Create a new task (Admin only)',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['title', 'assignedTo', 'customerId'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            assignedTo: { type: 'string', description: 'Employee user ID' },
            customerId: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'DONE'], default: 'PENDING' },
          },
        },
        response: {
          201: {
            description: 'Task created',
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string' },
              assignedTo: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
              customer: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                },
              },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    taskController.createTask.bind(taskController)
  );

  // GET /tasks - Get all tasks (Admin: all tasks, Employee: only assigned tasks)
  server.get(
    '/tasks',
    {
      preHandler: [authenticate, requireRole('ADMIN', 'EMPLOYEE')],
      schema: {
        tags: ['Tasks'],
        description: 'Get tasks (Admin: all tasks, Employee: only assigned tasks)',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'List of tasks',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'string' },
                assignedTo: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                  },
                },
                customer: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                  },
                },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
    taskController.getAllTasks.bind(taskController)
  );

  // PATCH /tasks/:id/status - Update task status
  server.patch<{ Params: { id: string }; Body: UpdateTaskStatusDTO }>(
    '/tasks/:id/status',
    {
      preHandler: [authenticate, requireRole('ADMIN', 'EMPLOYEE'), validateBody(updateTaskStatusSchema)],
      schema: {
        tags: ['Tasks'],
        description: 'Update task status (Admin: any task, Employee: only assigned tasks)',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'DONE'] },
          },
        },
        response: {
          200: {
            description: 'Task updated',
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string' },
              assignedTo: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
              customer: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                },
              },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    taskController.updateTaskStatus.bind(taskController)
  );
}