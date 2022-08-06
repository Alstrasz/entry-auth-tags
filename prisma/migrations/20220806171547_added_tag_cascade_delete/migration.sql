-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_creator_fkey";

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_creator_fkey" FOREIGN KEY ("creator") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
