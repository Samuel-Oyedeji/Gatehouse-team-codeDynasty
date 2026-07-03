// Estate details and settings (PRD §5.1 onboarding, §8 settings).
import type { AllocationRule } from "@prisma/client";
import { prisma } from "./db";
import { broadcast } from "./events";

export interface EstateDetailsInput {
  name?: string;
  address?: string;
  city?: string;
  cycleLabel?: string;
}

export async function updateEstateDetails(estateId: string, input: EstateDetailsInput) {
  const estate = await prisma.estate.update({ where: { id: estateId }, data: input });
  broadcast(estateId, "estate");
  return estate;
}

export interface FeeStructureInput {
  serviceChargeKobo?: number;
  serviceChargeCadence?: string;
  allocationRule?: AllocationRule;
  autoCreditThresholdKobo?: number;
  duplicateWindowSecs?: number;
}

export async function updateFeeStructure(estateId: string, input: FeeStructureInput) {
  const estate = await prisma.estate.update({ where: { id: estateId }, data: input });
  broadcast(estateId, "estate");
  return estate;
}

export async function connectNomba(estateId: string, nombaAccountId: string) {
  return prisma.estate.update({ where: { id: estateId }, data: { nombaAccountId } });
}
