import { FastifyInstance } from 'fastify';
import { CustomerController } from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createCustomerSchema, updateCustomerSchema } from '../dtos/customer.dto';

const customerController = new CustomerController();

export async function customerRoutes(server: FastifyInstance) {
  // POST /customers - Create customer (Admin only)
  server.post(
    '/customers',
    {
      preHandler: [authenticate, requireRole('ADMIN'), validateBody(createCustomerSchema)],
      schema: {
        tags: ['Customers'],
        description: 'Create a new customer (Admin only)',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['name', 'email', 'phone'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            company: { type: 'string' },
          },
        },
        response: {
          201: {
            description: 'Customer created',
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              company: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    customerController.createCustomer.bind(customerController)
  );

  // GET /customers - Get all customers with pagination (Admin + Employee)
  server.get(
    '/customers',
    {
      preHandler: [authenticate, requireRole('ADMIN', 'EMPLOYEE')],
      schema: {
        tags: ['Customers'],
        description: 'Get all customers with pagination (Admin + Employee)',
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', default: 1, description: 'Page number' },
            limit: { type: 'number', default: 10, description: 'Items per page' },
            search: { type: 'string', description: 'Search by name, email, phone, or company' },
          },
        },
        response: {
          200: {
            description: 'Paginated customer list',
            type: 'object',
            properties: {
              page: { type: 'number' },
              limit: { type: 'number' },
              totalRecords: { type: 'number' },
              totalPages: { type: 'number' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    company: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    customerController.getAllCustomers.bind(customerController)
  );

  // GET /customers/:id - Get customer by ID (Admin + Employee)
  server.get(
    '/customers/:id',
    {
      preHandler: [authenticate, requireRole('ADMIN', 'EMPLOYEE')],
      schema: {
        tags: ['Customers'],
        description: 'Get customer by ID (Admin + Employee)',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Customer details',
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              company: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    customerController.getCustomerById.bind(customerController)
  );

  // PATCH /customers/:id - Update customer (Admin only)
  server.patch(
    '/customers/:id',
    {
      preHandler: [authenticate, requireRole('ADMIN'), validateBody(updateCustomerSchema)],
      schema: {
        tags: ['Customers'],
        description: 'Update customer (Admin only)',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            company: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Customer updated',
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              company: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    customerController.updateCustomer.bind(customerController)
  );

  // DELETE /customers/:id - Delete customer (Admin only)
  server.delete(
    '/customers/:id',
    {
      preHandler: [authenticate, requireRole('ADMIN')],
      schema: {
        tags: ['Customers'],
        description: 'Delete customer (Admin only)',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Customer deleted',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    customerController.deleteCustomer.bind(customerController)
  );
}
