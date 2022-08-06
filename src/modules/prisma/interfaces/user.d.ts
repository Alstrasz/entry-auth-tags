import { Prisma } from '@prisma/client';

const user_with_tags = Prisma.validator<Prisma.UserArgs>()( {
    include: { tags: true },
} );

export type UserWithTags = Prisma.UserGetPayload<typeof user_with_tags>
