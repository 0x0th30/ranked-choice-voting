-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "votingUuid" TEXT NOT NULL,
    "voteSequence" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_id_key" ON "Vote"("id");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_votingUuid_fkey" FOREIGN KEY ("votingUuid") REFERENCES "Voting"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
