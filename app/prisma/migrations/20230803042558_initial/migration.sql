-- CreateEnum
CREATE TYPE "VotingState" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "Voting" (
    "sessionId" TEXT NOT NULL,
    "sessionName" TEXT NOT NULL,
    "availableOptions" TEXT[],
    "state" "VotingState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voting_pkey" PRIMARY KEY ("sessionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voting_sessionId_key" ON "Voting"("sessionId");
