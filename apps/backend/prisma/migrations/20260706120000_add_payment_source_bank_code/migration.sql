-- AlterTable
-- Adds the sender's bank code to payments so overpayment refunds can be issued
-- directly via the Nomba transfer API without parsing rawPayload.
ALTER TABLE "payments" ADD COLUMN "sourceBankCode" TEXT;
