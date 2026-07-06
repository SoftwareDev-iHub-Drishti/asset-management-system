import { Resend } from 'resend';
import { Action } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

type ProcessedAsset = { id: string; name: string };

export async function sendConfirmationEmail(params: {
to: string;
issuedTo: string;
issuedBy: string;
action: Action;
assets: ProcessedAsset[];
}) {
const { to, issuedTo, issuedBy, action, assets } = params;

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