/*
  Warnings:

  - You are about to drop the column `user_uuid` on the `Token` table. All the data in the column will be lost.
  - Added the required column `user_email` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_user_uuid_fkey";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "user_uuid",
ADD COLUMN     "user_email" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
