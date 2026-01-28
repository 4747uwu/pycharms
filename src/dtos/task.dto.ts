import { z } from 'zod';

// Task DTOs
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignedTo: z.string().min(1, 'AssignedTo is required'),
  customerId: z.string().min(1, 'CustomerId is required'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']).optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE'], { 
    errorMap: () => ({ message: 'Status must be PENDING, IN_PROGRESS, or DONE' }) 
  }),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskStatusDTO = z.infer<typeof updateTaskStatusSchema>;
