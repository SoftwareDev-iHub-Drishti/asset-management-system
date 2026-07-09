import { Resend } from 'resend';
import { Action } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

type ProcessedAsset = { id: string; name: string };

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendConfirmationEmail(params: {
to: string;
issuedTo: string;
issuedBy: string;
action: Action;
assets: ProcessedAsset[];
notes?: string;
}) {
const { to, issuedTo, issuedBy, action, assets, notes } = params;

const actionLabel = action === 'CHECK_OUT' ? 'Out' : 'In';
const verb = action === 'CHECK_OUT' ? 'checked out' : 'checked in';

const rows = assets
    .map(
    (a) => `
        <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${a.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:monospace;">${a.id}</td>
        </tr>`
    )
    .join('');

const notesBlock = notes && notes.trim()
    ? `<p style="margin:4px 0;"><strong>Notes:</strong> ${escapeHtml(notes)}</p>`
    : '';

const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2937;max-width:560px;margin:auto;">
    <h2 style="color:#2563eb;">Asset Management — Confirmation</h2>
    <p>Hi ${issuedTo || 'there'},</p>
    <p>This is a confirmation that the following ${
        assets.length > 1 ? 'assets have' : 'asset has'
    } been <strong>${verb}</strong>:</p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;margin:16px 0;">
        <thead>
        <tr style="background:#f3f4f6;text-align:left;">
            <th style="padding:8px 12px;">Asset Name</th>
            <th style="padding:8px 12px;">Asset ID</th>
        </tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>
    <p style="margin:4px 0;"><strong>Action:</strong> ${actionLabel}</p>
    <p style="margin:4px 0;"><strong>Issued By:</strong> ${issuedBy}</p>
    ${notesBlock}
    <p style="margin-top:24px;color:#6b7280;">Thank you for using the Asset Management System.</p>
    <p style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;">
        This is an automated message sent from an unmonitored mailbox. Please do not reply to this email.
    </p>
    </div>
`;

const result = await resend.emails.send({
    from: 'Asset Management <assets@ihub-drishti.ai>',
    to: [to],
    subject: `Asset ${actionLabel === 'Out' ? 'Checked Out' : 'Checked In'} — Confirmation`,
    html,
});

// console.log("RESEND RESULT:", JSON.stringify(result, null, 2)); (for error checking in terminal)

if (result.error) {
    throw new Error(`Resend API error: ${JSON.stringify(result.error)}`);
}
}

export async function sendOverdueReminderEmail(params: {
  to: string;
  issuedTo: string;
  issuedBy: string;
  assetName: string;
  assetId: string;
  daysOut: number;
}) {
  const { to, issuedTo, issuedBy, assetName, assetId, daysOut } = params;

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2937;max-width:560px;margin:auto;">
      <h2 style="color:#d97706;">Asset Management — Reminder</h2>
      <p>Hi ${issuedTo || 'there'},</p>
      <p>Our records show the following asset has been checked out for <strong>${daysOut} days</strong>:</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #eee;margin:16px 0;">
        <thead>
          <tr style="background:#f3f4f6;text-align:left;">
            <th style="padding:8px 12px;">Asset Name</th>
            <th style="padding:8px 12px;">Asset ID</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${assetName}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:monospace;">${assetId}</td>
          </tr>
        </tbody>
      </table>
      <p>If you still need this item, please visit the Asset Management System and re-submit a checkout entry so we know it's still in active use.</p>
      <p>If you're done with it, please return it to the Almirah and check it back in at your earliest convenience.</p>
      <p style="margin-top:8px;color:#6b7280;font-size:13px;">Issued by: ${issuedBy}</p>
      <p style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;">
        This is an automated message sent from an unmonitored mailbox. Please do not reply to this email.
      </p>
    </div>
  `;

  const result = await resend.emails.send({
    from: 'Asset Management <assets@ihub-drishti.ai>',
    to: [to],
    subject: `Reminder: Asset Checked Out for ${daysOut} Days — Action Needed`,
    html,
  });

  if (result.error) {
    throw new Error(`Resend API error: ${JSON.stringify(result.error)}`);
  }
}

export async function sendEscalationEmail(params: {
  issuerEmail: string;
  issuedBy: string;
  issuedTo: string;
  borrowerEmail: string;
  assetName: string;
  assetId: string;
  daysOut: number;
}) {
  const { issuerEmail, issuedBy, issuedTo, borrowerEmail, assetName, assetId, daysOut } = params;

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2937;max-width:560px;margin:auto;">
      <h2 style="color:#dc2626;">Asset Management — Overdue Escalation</h2>
      <p>Hi ${issuedBy},</p>
      <p>An asset you issued has been checked out for <strong>${daysOut} days</strong> and a reminder to the borrower has not resulted in a return or reconfirmation:</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #eee;margin:16px 0;">
        <thead>
          <tr style="background:#f3f4f6;text-align:left;">
            <th style="padding:8px 12px;">Asset Name</th>
            <th style="padding:8px 12px;">Asset ID</th>
            <th style="padding:8px 12px;">Issued To</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${assetName}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:monospace;">${assetId}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${issuedTo}</td>
          </tr>
        </tbody>
      </table>
      <p>Please follow up with ${issuedTo} directly to confirm the status of this asset.</p>
      <p style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;">
        This is an automated message sent from an unmonitored mailbox. Please do not reply to this email.
      </p>
    </div>
  `;

  const result = await resend.emails.send({
    from: 'Asset Management <assets@ihub-drishti.ai>',
    to: [issuerEmail],
    cc: [borrowerEmail],
    subject: `Overdue Escalation: ${assetName} (${assetId}) — ${daysOut} Days Out`,
    html,
  });

  if (result.error) {
    throw new Error(`Resend API error: ${JSON.stringify(result.error)}`);
  }
}