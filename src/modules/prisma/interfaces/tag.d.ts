import { Prisma } from '@prisma/client';

const tag_with_creator = Prisma.validator<Prisma.TagArgs>()( {
    include: { created_by: true },
} );

export type TagWithCreator = Prisma.TagGetPayload<typeof tag_with_creator>
