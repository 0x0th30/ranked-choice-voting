-- CreateEnum
CREATE TYPE "VotingState" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "Voting" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availableOptions" TEXT[],
    "state" "VotingState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voting_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voting_uuid_key" ON "Voting"("uuid");
