// Vendor payouts (PRD §5.5) via the Nomba Transfers API. Records each payout with
// its Nomba reference and status; drives the "money out" side of reports.
import { randomUUID } from "node:crypto";
import type { PayoutStatus } from "@prisma/client";
import { prisma } from "./db";
import { transferToBank } from "./nomba";
import { koboToNaira, formatNaira } from "../money";
import { broadcast } from "./events";

export interface VendorInput {
  name: string;
  category: string;
  bankName: string;
  bankCode?: string;
  accountNumber: string;
}

export async function addVendor(estateId: string, input: VendorInput) {
  const vendor = await prisma.vendor.create({ data: { estateId, ...input } });
  broadcast(estateId, "vendor");
  return vendor;
}

export async function payVendor(estateId: string, vendorId: string, amountKobo: number, note: string) {
  const vendor = await prisma.vendor.findUniqueOrThrow({ where: { id: vendorId } });
  const estate = await prisma.estate.findUniqueOrThrow({ where: { id: estateId } });
  const merchantTxRef = `payout-${randomUUID()}`;

  const payout = await prisma.payout.create({
    data: { estateId, vendorId, amountKobo, note, merchantTxRef, status: "PENDING" },
  });

  let status: PayoutStatus = "PENDING";
  let nombaTxnRef: string | null = null;
  try {
    const result = await transferToBank({
      amountNaira: koboToNaira(amountKobo),
      accountNumber: vendor.accountNumber,
      accountName: vendor.name,
      bankCode: vendor.bankCode ?? "",
      merchantTxRef,
      senderName: estate.name,
      narration: note,
    });
    nombaTxnRef = result.id ?? null;
    status = result.status === "SUCCESS" ? "SUCCESS" : "PENDING";
  } catch (err) {
    console.error("[payout] transfer failed", err);
    status = "FAILED";
  }

  await prisma.payout.update({ where: { id: payout.id }, data: { status, nombaTxnRef } });
  await prisma.activity.create({
    data: {
      estateId,
      message: `Paid ${vendor.name} ${formatNaira(amountKobo)} — ${note}${status === "FAILED" ? " (failed)" : ""}`,
    },
  });
  broadcast(estateId, "payout");
  return { payoutId: payout.id, status };
}
