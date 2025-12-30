import { randomUUID } from 'node:crypto'
import { env } from 'node:process'
import nodemailer from 'nodemailer'

async function parseRequestBody(req) {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  }

  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 1_000_000) {
        reject(new Error('Payload too large'))
        req.connection.destroy()
      }
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function validatePayload(payload) {
  const emailValue =
    typeof payload.email === 'string'
      ? payload.email.trim()
      : typeof payload.contactEmail === 'string'
        ? payload.contactEmail.trim()
        : ''

  const nameValue =
    typeof payload.fullName === 'string'
      ? payload.fullName.trim()
      : typeof payload.name === 'string'
        ? payload.name.trim()
        : ''

  if (!emailValue) {
    return { ok: false, error: 'Missing required field: email' }
  }

  if (!nameValue) {
    return { ok: false, error: 'Missing required field: name' }
  }

  return { ok: true }
}

function normalizeLeadPayload(body, context) {
  const fullName =
    typeof body.fullName === 'string'
      ? body.fullName.trim()
      : typeof body.name === 'string'
        ? body.name.trim()
        : ''

  const email =
    typeof body.email === 'string'
      ? body.email.trim()
      : typeof body.contactEmail === 'string'
        ? body.contactEmail.trim()
        : ''

  const vehicleCategory =
    typeof body.vehicleCategory === 'string'
      ? body.vehicleCategory.trim()
      : typeof body.vehicle === 'string'
        ? body.vehicle.trim()
        : ''

  const budgetRange = typeof body.budgetRange === 'string' ? body.budgetRange.trim() : ''
  const timeline = typeof body.timeline === 'string' ? body.timeline.trim() : ''

  const firstName = fullName.split(' ')[0] || 'there'

  return {
    leadId: context.leadId,
    submittedAt: context.timestamp,
    fullName,
    firstName,
    email,
    vehicleCategory: vehicleCategory || 'Not specified',
    budgetRange: budgetRange || 'Not specified',
    timeline: timeline || 'Not specified',
    notes: typeof body.notes === 'string' ? body.notes.trim() : undefined,
    leadSource: typeof body.leadSource === 'string' ? body.leadSource : 'edmonton-cars.ca',
    pipelineStage: typeof body.pipelineStage === 'string' ? body.pipelineStage : 'new',
    optedIn:
      typeof body.optIn === 'boolean'
        ? body.optIn
        : typeof body.optedIn === 'boolean'
          ? body.optedIn
          : undefined,
  }
}

async function pushToCrm(payload) {
  const crmWebhook = env.CRM_WEBHOOK_URL
  if (!crmWebhook) {
    console.info('[LeadPipeline] CRM webhook not configured. Payload logged for manual follow-up.')
    console.info(JSON.stringify(payload, null, 2))
    return { status: 'mocked' }
  }

  try {
    const response = await fetch(crmWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.CRM_WEBHOOK_TOKEN
          ? {
              Authorization: `Bearer ${env.CRM_WEBHOOK_TOKEN}`,
            }
          : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[LeadPipeline] CRM webhook responded non-2xx', response.status, errorText)
      return { status: 'failed', error: `CRM webhook failed: ${response.status}` }
    }

    return { status: 'forwarded' }
  } catch (error) {
    console.error('[LeadPipeline] CRM webhook network failure', error)
    return { status: 'failed', error: error instanceof Error ? error.message : 'CRM webhook request failed' }
  }
}

function getSmtpConfig() {
  const smtpEmail = env.SMTP_EMAIL
  const smtpPasswordRaw = env.SMTP_PASSWORD
  const smtpPassword = typeof smtpPasswordRaw === 'string' ? smtpPasswordRaw.replace(/\s+/g, '') : undefined

  if (!smtpEmail || !smtpPassword) {
    return null
  }

  return { smtpEmail, smtpPassword }
}

function buildLeadAutoReplyHtml(payload) {
  const vehicleLine = payload.vehicleCategory && payload.vehicleCategory !== 'Not specified' ? payload.vehicleCategory : 'your vehicle search'

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.45;">
      <h2 style="margin: 0 0 12px;">Thank You for Your Vehicle Request!</h2>
      <p style="margin: 0 0 12px;">Hi ${payload.firstName},</p>
      <p style="margin: 0 0 12px;">We've received your request for <strong>${vehicleLine}</strong>. Our team will reach out shortly with next steps and a clear plan to help you buy with confidence.</p>
      <h3 style="margin: 18px 0 8px;">What Happens Next:</h3>
      <ul style="margin: 0 0 12px; padding-left: 18px;">
        <li style="margin-bottom: 6px;"><strong>Within 24 hours:</strong> We'll call or email you with a few quick questions (budget, timeline, must-haves).</li>
        <li style="margin-bottom: 6px;"><strong>Briefing details:</strong> We'll confirm pricing ranges, comparable listings, and what to ask dealers/lenders.</li>
        <li><strong>Next steps:</strong> If you want, we can help draft counter-offers, negotiation messages, and inspection checklists.</li>
      </ul>
      <p style="margin: 0 0 12px;">Questions? Contact us directly:</p>
      <p style="margin: 0 0 18px;">
        Phone: (587) 501-6994<br />
        Email: <a href="mailto:ky.group.solutions@gmail.com">ky.group.solutions@gmail.com</a>
      </p>
      <p style="margin: 0;">Thanks,<br />Edmonton Cars Concierge Team</p>
      <hr style="margin: 22px 0; border: none; border-top: 1px solid #e2e8f0;" />
      <p style="margin: 0; font-size: 12px; color: #64748b;">You received this confirmation because you submitted a request on edmonton-cars.ca.<br/>Lead ID: ${payload.leadId}</p>
    </div>
  `
}

function buildLeadInternalHtml(payload) {
  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.45;">
      <h2 style="margin: 0 0 12px;">New Lead (Edmonton Cars)</h2>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${payload.fullName}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
      <p style="margin: 0 0 8px;"><strong>Vehicle / Goal:</strong> ${payload.vehicleCategory}</p>
      <p style="margin: 0 0 8px;"><strong>Budget:</strong> ${payload.budgetRange}</p>
      <p style="margin: 0 0 8px;"><strong>Timeline:</strong> ${payload.timeline}</p>
      ${payload.notes ? `<p style="margin: 0 0 8px;"><strong>Notes:</strong> ${payload.notes}</p>` : ''}
      <hr style="margin: 18px 0; border: none; border-top: 1px solid #e2e8f0;" />
      <p style="margin: 0; font-size: 12px; color: #64748b;">Lead ID: ${payload.leadId}<br/>Submitted: ${payload.submittedAt}<br/>Source: ${payload.leadSource}</p>
    </div>
  `
}

async function sendAutomations(payload) {
  const smtpConfig = getSmtpConfig()
  if (!smtpConfig) {
    console.info('[LeadPipeline] SMTP not configured. Skipping email notifications.')
    return { internal: 'skipped', autoReply: 'skipped' }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpConfig.smtpEmail,
      pass: smtpConfig.smtpPassword,
    },
  })

  const from = `Edmonton Cars Concierge <${smtpConfig.smtpEmail}>`

  await transporter.sendMail({
    from,
    to: smtpConfig.smtpEmail,
    replyTo: payload.email,
    subject: `New lead: ${payload.fullName}`,
    html: buildLeadInternalHtml(payload),
  })

  await transporter.sendMail({
    from,
    to: payload.email,
    replyTo: smtpConfig.smtpEmail,
    subject: 'Thank you for your request — Edmonton Cars Concierge',
    html: buildLeadAutoReplyHtml(payload),
  })

  return { internal: 'sent', autoReply: 'sent' }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  try {
    const body = await parseRequestBody(req)
    const validation = validatePayload(body)

    if (!validation.ok) {
      res.status(400).json({ error: validation.error })
      return
    }

    const leadId = randomUUID()
    const timestamp = new Date().toISOString()
    const normalizedPayload = normalizeLeadPayload(body, { leadId, timestamp })

    const crmResult = await pushToCrm(normalizedPayload)
    const emailResult = await sendAutomations(normalizedPayload)

    res.status(200).json({
      ok: true,
      leadId,
      crm: crmResult,
      email: emailResult,
    })
  } catch (error) {
    console.error('[LeadPipeline] Submission failed', error)
    res.status(500).json({ error: error.message ?? 'Unhandled server error' })
  }
}