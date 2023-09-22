-- CreateEnum
CREATE TYPE "TokenValidity" AS ENUM ('UNUSED', 'REVOKED', 'EXPIRED');

-- CreateTable
CREATE TABLE "ValidationToken" (
    "token" TEXT NOT NULL,
    "status" "TokenValidity" NOT NULL,
    "expiry_time" TIMESTAMP(3) NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValidationToken_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "ValidationToken_token_key" ON "ValidationToken"("token");

-- AddForeignKey
ALTER TABLE "ValidationToken" ADD CONSTRAINT "ValidationToken_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
