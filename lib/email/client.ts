import { Resend } from 'resend'

let instance: Resend | null = null

export function getResend(): Resend {
  if (instance) return instance

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('Missing RESEND_API_KEY')

  instance = new Resend(apiKey)
  return instance
}

const FROM = process.env.EMAIL_FROM ?? 'PitchCraft <noreply@pitchcraft.app>'

export async function sendDonorConfirmation({
  to,
  donorName,
  projectName,
  amount,
  currency,
  paymentId,
}: {
  to: string
  donorName: string
  projectName: string
  amount: number
  currency: string
  paymentId: string
}) {
  const resend = getResend()
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your support for "${projectName}" is confirmed`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <p style="font-size:16px">Hi ${donorName},</p>
        <p style="font-size:16px">Thank you for supporting <strong>${projectName}</strong>.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Amount</td><td style="padding:8px 0;font-size:14px;font-weight:600">${formatted}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Reference</td><td style="padding:8px 0;font-size:14px;font-family:monospace">${paymentId}</td></tr>
        </table>
        <p style="font-size:14px;color:#666">Your payment was processed securely by Razorpay. PitchCraft never stores your card details.</p>
        <p style="font-size:14px;color:#666">Keep this email as your payment record.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:12px;color:#999">PitchCraft · Secure payments by Razorpay (PCI-DSS Level 1)</p>
      </div>
    `,
  })
}

export async function sendCreatorDonationAlert({
  to,
  creatorName,
  projectName,
  donorName,
  amount,
  currency,
  message,
  paymentId,
}: {
  to: string
  creatorName: string
  projectName: string
  donorName: string
  amount: number
  currency: string
  message?: string | null
  paymentId: string
}) {
  const resend = getResend()
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)

  await resend.emails.send({
    from: FROM,
    to,
    subject: `${donorName} supported "${projectName}"`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <p style="font-size:16px">Hi ${creatorName},</p>
        <p style="font-size:16px">You have a new supporter for <strong>${projectName}</strong>.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Supporter</td><td style="padding:8px 0;font-size:14px">${donorName}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Amount</td><td style="padding:8px 0;font-size:14px;font-weight:600">${formatted}</td></tr>
          ${message ? `<tr><td style="padding:8px 0;color:#666;font-size:14px">Message</td><td style="padding:8px 0;font-size:14px;font-style:italic">"${message}"</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Reference</td><td style="padding:8px 0;font-size:14px;font-family:monospace">${paymentId}</td></tr>
        </table>
        <p style="font-size:14px;color:#666">Payouts are processed within 7 business days to your registered bank account.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:12px;color:#999">PitchCraft · Secure payments by Razorpay (PCI-DSS Level 1)</p>
      </div>
    `,
  })
}
