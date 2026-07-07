import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOverdueReminderEmail, sendEscalationEmail } from "@/lib/email";

// Lookup table: issuer name -> their email address
const ISSUER_EMAILS: Record<string, string> = {
  "Kalpesh Sompura": "kalpeshs@ihub-drishti.ai",
  "Dr. Vishakha Pareek": "vishakhapareek@ihub-drishti.ai",
};

const REMINDER_THRESHOLD_DAYS = 15;
const ESCALATION_THRESHOLD_DAYS = 7; // days after reminder was sent

function daysSince(date: Date): number {
  const diffMs = Date.now() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    remindersSent: 0,
    escalationsSent: 0,
    errors: [] as string[],
  };

  try {
    // Find all currently-checked-out assets with their latest log
    const checkedOutAssets = await prisma.asset.findMany({
      where: { availableQuantity: 0 },
      include: {
        logs: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    for (const asset of checkedOutAssets) {
      const latestLog = asset.logs[0];
      if (!latestLog || latestLog.action !== "CHECK_OUT") continue;

      const daysOut = daysSince(latestLog.createdAt);

      // --- STAGE 1: Reminder at 15+ days, not yet sent ---
      if (daysOut >= REMINDER_THRESHOLD_DAYS && !latestLog.reminderSentAt) {
        try {
          await sendOverdueReminderEmail({
            to: latestLog.emailAddress,
            issuedTo: latestLog.issuedTo,
            issuedBy: latestLog.issuedBy,
            assetName: asset.name,
            assetId: asset.id,
            daysOut,
          });

          await prisma.log.update({
            where: { id: latestLog.id },
            data: { reminderSentAt: new Date() },
          });

          results.remindersSent++;
        } catch (err) {
          results.errors.push(`Reminder failed for asset ${asset.id}: ${err}`);
        }
        continue; // don't also escalate in the same run
      }

      // --- STAGE 2: Escalation, 7+ days after reminder, not yet escalated ---
      if (
        latestLog.reminderSentAt &&
        !latestLog.escalatedAt &&
        daysSince(latestLog.reminderSentAt) >= ESCALATION_THRESHOLD_DAYS
      ) {
        const issuerEmail = ISSUER_EMAILS[latestLog.issuedBy];

        if (!issuerEmail) {
          results.errors.push(
            `No email mapping found for issuer "${latestLog.issuedBy}" (asset ${asset.id})`
          );
          continue;
        }

        try {
          await sendEscalationEmail({
            issuerEmail,
            issuedBy: latestLog.issuedBy,
            issuedTo: latestLog.issuedTo,
            borrowerEmail: latestLog.emailAddress,
            assetName: asset.name,
            assetId: asset.id,
            daysOut,
          });

          await prisma.log.update({
            where: { id: latestLog.id },
            data: { escalatedAt: new Date() },
          });

          results.escalationsSent++;
        } catch (err) {
          results.errors.push(`Escalation failed for asset ${asset.id}: ${err}`);
        }
      }
    }

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error("Overdue check cron failed:", error);
    return NextResponse.json(
      { success: false, error: "Cron job failed", details: String(error) },
      { status: 500 }
    );
  }
}