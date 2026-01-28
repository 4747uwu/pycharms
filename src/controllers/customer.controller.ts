import { FastifyRequest, FastifyReply } from 'fastify';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos/customer.dto';

const customerService = new CustomerService();

export class CustomerController {
  async createCustomer(request: FastifyRequest<{ Body: CreateCustomerDTO }>, reply: FastifyReply) {
    try {
      const customer = await customerService.createCustomer(request.body);
      return reply.status(201).send(customer);
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

  async getAllCustomers(
    request: FastifyRequest<{ Querystring: { page?: string; limit?: string; search?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const page = parseInt(request.query.page || '1');
      const limit = parseInt(request.query.limit || '10');
      const search = request.query.search;

      const result = await customerService.getAllCustomers(page, limit, search);
      return reply.status(200).send(result);
    } catch (error: any) {
      throw error;
    }
  }

  async getCustomerById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const customer = await customerService.getCustomerById(request.params.id);
      return reply.status(200).send(customer);
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

  async updateCustomer(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateCustomerDTO }>,
    reply: FastifyReply
  ) {
    try {
      const customer = await customerService.updateCustomer(request.params.id, request.body);
      return reply.status(200).send(customer);
    } catch (error: any) {
      if (error.statusCode) {
        return reply.status(error.statusCode).send({
          statusCode: error.statusCode,
          error: error.statusCode === 404 ? 'Not Found' : 'Conflict',
          message: error.message,
        });
      }
      throw error;
    }
  }

  async deleteCustomer(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const result = await customerService.deleteCustomer(request.params.id);
      return reply.status(200).send(result);
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
