import { User } from '@prisma/client';
import { Request } from 'express';
import { UserWithTags } from 'src/prisma/interfaces/user';

export interface RequestWithUser extends Request {
    user: User;
}

export interface RequestWithUserAndTags extends Request {
    user: UserWithTags;
}
