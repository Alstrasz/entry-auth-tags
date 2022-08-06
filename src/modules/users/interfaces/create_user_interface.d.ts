import { User } from '@prisma/client';

export type CreateUserInterface = Omit<User, 'id'>
