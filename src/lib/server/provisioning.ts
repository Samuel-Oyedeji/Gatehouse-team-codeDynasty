// Unit provisioning (PRD §5.1): create a unit, provision its dedicated Nomba
// virtual account, and mint a resident statement link.
import { randomBytes } from "node:crypto";
import type { OccupancyType } from "@prisma/client";
import { prisma } from "./db";
import { createVirtualAccount } from "./nomba";
import { accountRefFor, accountNameFor } from "./domain-helpers";
import { broadcast } from "./events";

export interface UnitInput {
  label: string;
  block: string;
  occupantName: string;
  occupantPhone?: string;
  occupancyType?: OccupancyType;
  bvn?: string;
}

export interface ProvisionedUnit {
  unitId: string;
  label: string;
  accountNumber: string | null;
  bankName: string | null;
  token: string;
}

export async function provisionUnit(estateId: string, input: UnitInput): Promise<ProvisionedUnit> {
  const estate = await prisma.estate.findUniqueOrThrow({ where: { id: estateId } });

  const unit = await prisma.unit.create({
    data: {
      estateId,
      label: input.label,
      block: input.block,
      occupantName: input.occupantName,
      occupantPhone: input.occupantPhone,
      occupancyType: input.occupancyType ?? "OWNER",
      status: "UNBILLED",
    },
  });

  const accountRef = accountRefFor(estateId, unit.id);
  let accountNumber: string | null = null;
  let bankName: string | null = null;
  try {
    const va = await createVirtualAccount({
      accountRef,
      accountName: accountNameFor(estate.name, input.label),
      bvn: input.bvn,
    });
    accountNumber = va.accountNumber;
    bankName = va.bankName;
    await prisma.virtualAccount.create({
      data: {
        unitId: unit.id,
        nombaAccountRef: accountRef,
        accountNumber,
        bankName,
        status: "ACTIVE",
        provisionedAt: new Date(),
      },
    });
  } catch (err) {
    console.error(`[provision] virtual account failed for ${input.label}`, err);
    await prisma.virtualAccount.create({
      data: { unitId: unit.id, nombaAccountRef: accountRef, status: "PENDING" },
    });
  }

  const token = randomBytes(16).toString("hex");
  await prisma.residentLink.create({ data: { unitId: unit.id, token } });

  broadcast(estateId, "unit");
  return { unitId: unit.id, label: unit.label, accountNumber, bankName, token };
}

export async function provisionUnits(estateId: string, rows: UnitInput[]): Promise<ProvisionedUnit[]> {
  const out: ProvisionedUnit[] = [];
  for (const row of rows) {
    out.push(await provisionUnit(estateId, row));
  }
  return out;
}
