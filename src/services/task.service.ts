import prisma from '../utils/prisma';
import { CreateTaskDTO, UpdateTaskStatusDTO } from '../dtos/task.dto';

export class TaskService {
  async createTask(data: CreateTaskDTO) {
    // Verify assignedTo user exists and is an EMPLOYEE
    const assignedUser = await prisma.user.findUnique({
      where: { id: data.assignedTo },
      select: { id: true, role: true },
    });

    if (!assignedUser) {
      throw { statusCode: 404, message: 'Assigned user not found' };
    }

    if (assignedUser.role !== 'EMPLOYEE') {
      throw { statusCode: 400, message: 'Tasks can only be assigned to EMPLOYEE role' };
    }

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: data.customerId },
      select: { id: true },
    });

    if (!customer) {
      throw { statusCode: 404, message: 'Customer not found' };
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || 'PENDING',
        assignedToId: data.assignedTo,
        customerId: data.customerId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return task;
  }

  async getAllTasks(userId: string, userRole: string) {
    const where = userRole === 'ADMIN' 
      ? {} 
      : { assignedToId: userId };

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tasks;
  }

  async updateTaskStatus(taskId: string, data: UpdateTaskStatusDTO, userId: string, userRole: string) {
    // Get task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { assignedToId: true },
    });

    if (!task) {
      throw { statusCode: 404, message: 'Task not found' };
    }

    // Check permissions: EMPLOYEE can only update their own tasks
    if (userRole === 'EMPLOYEE' && task.assignedToId !== userId) {
      throw { 
        statusCode: 403, 
        message: 'You can only update tasks assigned to you' 
      };
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: data.status },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return updatedTask;
  }
}
