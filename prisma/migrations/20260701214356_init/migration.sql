-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('service_fee', 'levy');

-- CreateEnum
CREATE TYPE "FeeFrequency" AS ENUM ('monthly', 'quarterly', 'yearly', 'one_time');

-- CreateEnum
CREATE TYPE "OccupantType" AS ENUM ('owner', 'tenant');

-- CreateTable
CREATE TABLE "managers" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estates" (
    "id" UUID NOT NULL,
    "managerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "estates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fees" (
    "id" UUID NOT NULL,
    "estateId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FeeType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "frequency" "FeeFrequency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" UUID NOT NULL,
    "estateId" UUID NOT NULL,
    "block" TEXT NOT NULL,
    "unitName" TEXT NOT NULL,
    "occupant" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "OccupantType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "unitId" UUID NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountRef" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "managers_email_key" ON "managers"("email");

-- CreateIndex
CREATE INDEX "managers_email_idx" ON "managers"("email");

-- CreateIndex
CREATE INDEX "managers_id_idx" ON "managers"("id");

-- CreateIndex
CREATE INDEX "managers_fullName_idx" ON "managers"("fullName");

-- CreateIndex
CREATE INDEX "estates_name_idx" ON "estates"("name");

-- CreateIndex
CREATE INDEX "estates_id_idx" ON "estates"("id");

-- CreateIndex
CREATE INDEX "fees_id_idx" ON "fees"("id");

-- CreateIndex
CREATE INDEX "fees_name_idx" ON "fees"("name");

-- CreateIndex
CREATE INDEX "fees_type_idx" ON "fees"("type");

-- CreateIndex
CREATE INDEX "units_id_idx" ON "units"("id");

-- CreateIndex
CREATE INDEX "units_unitName_idx" ON "units"("unitName");

-- CreateIndex
CREATE INDEX "units_email_idx" ON "units"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_unitId_key" ON "accounts"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_accountRef_key" ON "accounts"("accountRef");

-- CreateIndex
CREATE INDEX "accounts_id_idx" ON "accounts"("id");

-- CreateIndex
CREATE INDEX "accounts_accountName_idx" ON "accounts"("accountName");

-- CreateIndex
CREATE INDEX "accounts_accountNumber_idx" ON "accounts"("accountNumber");

-- AddForeignKey
ALTER TABLE "estates" ADD CONSTRAINT "estates_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "managers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fees" ADD CONSTRAINT "fees_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "estates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "estates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
