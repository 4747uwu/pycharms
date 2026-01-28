import prisma from '../utils/prisma';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos/customer.dto';

export class CustomerService {
  async createCustomer(data: CreateCustomerDTO) {
    try {
      const customer = await prisma.customer.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
        },
      });

      return customer;
    } catch (error: any) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        throw { 
          statusCode: 409, 
          message: `Customer with this ${field} already exists` 
        };
      }
      throw error;
    }
  }

  async getAllCustomers(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as any } },
            { email: { contains: search, mode: 'insensitive' as any } },
            { phone: { contains: search } },
            { company: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [customers, totalRecords] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      data: customers,
    };
  }

  async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw { statusCode: 404, message: 'Customer not found' };
    }

    return customer;
  }

  async updateCustomer(id: string, data: UpdateCustomerDTO) {
    try {
      const customer = await prisma.customer.update({
        where: { id },
        data,
      });

      return customer;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw { statusCode: 404, message: 'Customer not found' };
      }
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        throw { 
          statusCode: 409, 
          message: `Customer with this ${field} already exists` 
        };
      }
      throw error;
    }
  }

  async deleteCustomer(id: string) {
    try {
      await prisma.customer.delete({
        where: { id },
      });

      return { message: 'Customer deleted successfully' };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw { statusCode: 404, message: 'Customer not found' };
      }
      throw error;
    }
  }
}
