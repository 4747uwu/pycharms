import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { authRoutes } from './src/routes/auth.routes';
import { userRoutes } from './src/routes/user.routes';
import { customerRoutes } from './src/routes/customer.routes';
import { taskRoutes } from './src/routes/task.routes';
import prisma from './src/utils/prisma';

// ============================================
// FASTIFY SERVER SETUP
// ============================================
const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    } : undefined,
  },
  trustProxy: true,
});

// ============================================
// PLUGINS
// ============================================
async function registerPlugins() {
  // CORS
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Security headers
  await server.register(helmet, {
    contentSecurityPolicy: false,
  });

  // Swagger Documentation
  await server.register(swagger, {
    openapi: {
      info: {
        title: 'Mini CRM Backend API',
        description: 'Backend Developer Intern Assignment - Prysm Labs',
        version: '1.0.0',
      },
      servers: [
        {
          url: `https://pycharms.onrender.com`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT token',
          },
        },
      },
      tags: [
        { name: 'Authentication', description: 'Authentication endpoints' },
        { name: 'Users', description: 'User management (Admin only)' },
        { name: 'Customers', description: 'Customer management' },
        { name: 'Tasks', description: 'Task management' },
      ],
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
  });
}

// ============================================
// REGISTER ROUTES
// ============================================
async function registerRoutes() {
  // Health check
  server.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: Date.now(),
      uptime: process.uptime(),
    };
  });

  // API Routes
  await authRoutes(server);
  await userRoutes(server);
  await customerRoutes(server);
  await taskRoutes(server);
}

// ============================================
// ERROR HANDLING
// ============================================
server.setErrorHandler(async (error, request, reply) => {
  server.log.error(error);

  const isDev = process.env.NODE_ENV === 'development';

  return reply.status(error.statusCode || 500).send({
    statusCode: error.statusCode || 500,
    error: error.name || 'Internal Server Error',
    message: isDev ? error.message : 'An error occurred',
    ...(isDev && { stack: error.stack }),
  });
});

// Not found handler
server.setNotFoundHandler(async (request, reply) => {
  return reply.status(404).send({
    statusCode: 404,
    error: 'Not Found',
    message: 'Route not found',
    path: request.url,
  });
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
const gracefulShutdown = async (signal: string) => {
  server.log.info(`${signal} received, shutting down gracefully...`);

  try {
    await server.close();
    await prisma.$disconnect();
    server.log.info('Server closed successfully');
    process.exit(0);
  } catch (error) {
    server.log.error(error,'Error during shutdown:');
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// ============================================
// START SERVER
// ============================================
async function start() {
  try {
    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();

    // Test database connection
    await prisma.$connect();
    server.log.info('✅ Database connected successfully');

    // Start server
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });

    server.log.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         Mini CRM Backend - Prysm Labs Assignment          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

🚀 Server:      http://${host}:${port}
📚 API Docs:    http://${host}:${port}/api-docs
❤️  Health:     http://${host}:${port}/health

📋 Available Endpoints:
   • POST   /auth/register          - Register new user
   • POST   /auth/login             - Login
   • GET    /users                  - Get all users (Admin)
   • GET    /users/:id              - Get user by ID (Admin)
   • PATCH  /users/:id              - Update user role (Admin)
   • POST   /customers              - Create customer (Admin)
   • GET    /customers              - Get all customers (Admin + Employee)
   • GET    /customers/:id          - Get customer by ID (Admin + Employee)
   • PATCH  /customers/:id          - Update customer (Admin)
   • DELETE /customers/:id          - Delete customer (Admin)
   • POST   /tasks                  - Create task (Admin)
   • GET    /tasks                  - Get tasks (Admin: all, Employee: assigned)
   • PATCH  /tasks/:id/status       - Update task status

✨ Ready to accept connections!
    `);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();
