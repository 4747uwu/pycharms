import { z } from 'zod';

// User DTOs
export const updateUserRoleSchema = z.object({
  role: z.enum(['ADMIN', 'EMPLOYEE'], { errorMap: () => ({ message: 'Role must be ADMIN or EMPLOYEE' }) }),
});

export type UpdateUserRoleDTO = z.infer<typeof updateUserRoleSchema>;
