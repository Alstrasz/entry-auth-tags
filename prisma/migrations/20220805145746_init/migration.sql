-- CreateTable
CREATE TABLE "users" (
    "id" CHAR(36) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "salt" VARCHAR(16) NOT NULL,
    "nickname" VARCHAR(40) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "creator" CHAR(36) NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_assigned_tags_to_user" (
    "A" INTEGER NOT NULL,
    "B" CHAR(36) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "_assigned_tags_to_user_AB_unique" ON "_assigned_tags_to_user"("A", "B");

-- CreateIndex
CREATE INDEX "_assigned_tags_to_user_B_index" ON "_assigned_tags_to_user"("B");

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_creator_fkey" FOREIGN KEY ("creator") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_assigned_tags_to_user" ADD CONSTRAINT "_assigned_tags_to_user_A_fkey" FOREIGN KEY ("A") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_assigned_tags_to_user" ADD CONSTRAINT "_assigned_tags_to_user_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
