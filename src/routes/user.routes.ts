import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { updateUserRoleSchema, UpdateUserRoleDTO } from '../dtos/user.dto';

const userController = new UserController();

export async function userRoutes(server: FastifyInstance) {
  // GET /users - Get all users (Admin only)
  server.get(
    '/users',
    {
      preHandler: [authenticate, requireRole('ADMIN')],
      schema: {
        tags: ['Users'],
        description: 'Get all users (Admin only)',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'List of users',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                createdAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
    userController.getAllUsers.bind(userController)
  );

  // GET /users/:id - Get user by ID (Admin only)
  server.get<{ Params: { id: string } }>(
    '/users/:id',
    {
      preHandler: [authenticate, requireRole('ADMIN')],
      schema: {
        tags: ['Users'],
        description: 'Get user by ID (Admin only)',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'User details',
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    userController.getUserById.bind(userController)
  );

  // PATCH /users/:id - Update user role (Admin only)
  server.patch<{ Params: { id: string }; Body: UpdateUserRoleDTO }>(
    '/users/:id',
    {
      preHandler: [authenticate, requireRole('ADMIN'), validateBody(updateUserRoleSchema)],
      schema: {
        tags: ['Users'],
        description: 'Update user role (Admin only)',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          required: ['role'],
          properties: {
            role: { type: 'string', enum: ['ADMIN', 'EMPLOYEE'] },
          },
        },
        response: {
          200: {
            description: 'User updated',
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    userController.updateUserRole.bind(userController)
  );
}