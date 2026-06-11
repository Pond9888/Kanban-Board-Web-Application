export const runtime = 'edge'
export const maxDuration = 30
import { NextRequest, NextResponse } from 'next/server'

// Server-side proxy so webhook calls are not blocked by browser CORS.
// Restricted to known automation platforms to avoid acting as an open proxy.
const ALLOWED_HOSTS = ['.make.com', '.integromat.com', 'hooks.zapier.com', 'webhook.site', '.n8n.cloud']

export async function POST(req: NextRequest) {
  const { url, payload } = await req.json()

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ ok: false, detail: 'Invalid URL' }, { status: 400 })
  }

  const allowed =
    parsed.protocol === 'https:' &&
    ALLOWED_HOSTS.some((h) => (h.startsWith('.') ? parsed.hostname.endsWith(h) : parsed.hostname === h))
  if (!allowed) {
    return NextResponse.json(
      { ok: false, detail: 'Host not allowed. Use a Make / Zapier / n8n / webhook.site URL (https).' },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    })
    const text = (await res.text()).slice(0, 200)
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      detail: res.ok ? `Delivered (HTTP ${res.status}${text ? ` — ${text}` : ''})` : `Webhook returned HTTP ${res.status}`,
    })
  } catch {
    return NextResponse.json({ ok: false, detail: 'Could not reach webhook URL' }, { status: 502 })
  }
}
