import { randomUUID } from 'node:crypto'
import { env } from 'node:process'

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
  const requiredStringFields = ['vehicleCategory', 'budgetRange', 'timeline', 'fullName', 'email']
  const missing = requiredStringFields.filter(
    (field) => typeof payload[field] !== 'string' || payload[field].trim().length === 0,
  )

  if (missing.length) {
    return { ok: false, error: `Missing required fields: ${missing.join(', ')}` }
  }

  if (typeof payload.optIn !== 'boolean' || payload.optIn === false) {
    return {
      ok: false,
      error: 'Consent (optIn) is required to deliver the concierge plan.',
    }
  }

  return { ok: true }
}

async function pushToCrm(payload) {
  const crmWebhook = env.CRM_WEBHOOK_URL
  if (!crmWebhook) {
    console.info('[LeadPipeline] CRM webhook not configured. Payload logged for manual follow-up.')
    console.info(JSON.stringify(payload, null, 2))
    return { status: 'mocked' }
  }

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
    throw new Error(`CRM webhook failed: ${response.status} ${errorText}`)
  }

  return { status: 'forwarded' }
}

async function sendAutomations(payload, context) {
  const resendKey = env.RESEND_API_KEY
  if (!resendKey) {
    console.info('[LeadPipeline] Resend API key missing. Skipping transactional email.')
    return { email: 'skipped' }
  }

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; color: #0f172a;">
      <h2 style="margin-bottom: 12px;">Your Concierge Vehicle Plan Is In Motion</h2>
      <p>Hi ${payload.fullName.split(' ')[0] || 'there'},</p>
      <p>Thanks for sharing what you're looking for. Our Edmonton concierge team is already curating vehicles that match:</p>
      <ul>
        <li><strong>Vehicle focus:</strong> ${payload.vehicleCategory}</li>
        <li><strong>Budget band:</strong> ${payload.budgetRange}</li>
        <li><strong>Timeline:</strong> ${payload.timeline}</li>
        ${
          payload.purchasePriority
            ? `<li><strong>Priorities:</strong> ${payload.purchasePriority}</li>`
            : ''
        }
      </ul>
      <p>Expect your personalized shortlist in the next few minutes. Want to accelerate things? Reply to this email with any trade-in details or must-have features.</p>
      <p style="margin-top: 18px;">Best,<br/>Edmonton Cars Concierge Team</p>
      <hr style="margin: 28px 0; border: none; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 12px; color: #64748b;">Consent timestamp: ${context.timestamp}<br/>Lead ID: ${
        context.leadId
      }</p>
    </div>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL ?? 'concierge@edmonton-cars.ca',
      to: payload.email,
      subject: 'Your Edmonton Concierge Vehicle Plan',
      html,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Resend failure: ${response.status} ${text}`)
  }

  return { email: 'sent' }
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
    const normalizedPayload = {
      leadId,
      submittedAt: timestamp,
      ...body,
      pipelineStage: body.pipelineStage ?? 'new',
      leadSource: body.leadSource ?? 'edmonton-cars.ca',
    }

    const crmResult = await pushToCrm(normalizedPayload)
    const emailResult = await sendAutomations(normalizedPayload, { timestamp, leadId })

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