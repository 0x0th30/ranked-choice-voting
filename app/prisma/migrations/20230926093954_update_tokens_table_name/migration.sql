/*
  Warnings:

  - You are about to drop the `ValidationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ValidationToken" DROP CONSTRAINT "ValidationToken_user_uuid_fkey";

-- DropTable
DROP TABLE "ValidationToken";

-- CreateTable
CREATE TABLE "Token" (
    "token" TEXT NOT NULL,
    "status" "TokenValidity" NOT NULL,
    "expiry_time" TIMESTAMP(3) NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
