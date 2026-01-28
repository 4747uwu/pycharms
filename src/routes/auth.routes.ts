import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../dtos/auth.dto';

const authController = new AuthController();

export async function authRoutes(server: FastifyInstance) {
  // POST /auth/register
  server.post(
    '/auth/register',
    {
      preHandler: [validateBody(registerSchema)],
      schema: {
        tags: ['Authentication'],
        description: 'Register a new user',
        body: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', format: 'email', description: 'User email' },
            password: { type: 'string', minLength: 8, description: 'User password (min 8 characters)' },
            role: { type: 'string', enum: ['ADMIN', 'EMPLOYEE'], description: 'User role' },
          },
        },
        response: {
          201: {
            description: 'User registered successfully',
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
    authController.register.bind(authController)
  );

  // POST /auth/login
  server.post(
    '/auth/login',
    {
      preHandler: [validateBody(loginSchema)],
      schema: {
        tags: ['Authentication'],
        description: 'Login and get JWT token',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Login successful',
            type: 'object',
            properties: {
              accessToken: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    authController.login.bind(authController)
  );
}
