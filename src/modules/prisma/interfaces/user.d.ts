import { Prisma } from '@prisma/client';

const user_with_tags = Prisma.validator<Prisma.UserArgs>()( {
    include: { tags: true },
} );

const user_with_created_tags = Prisma.validator<Prisma.UserArgs>()( {
    include: { created_tags: true },
} );

export type UserWithTags = Prisma.UserGetPayload<typeof user_with_tags>

export type UserWithCreatedTags = Prisma.UserGetPayload<typeof user_with_created_tags>
