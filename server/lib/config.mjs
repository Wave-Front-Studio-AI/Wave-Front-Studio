function number(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

function normalizeApiUrl(value) {
  const trimmed = String(value).trim().replace(/\/+$/, '')
  return /\/api($|\/)/.test(trimmed) ? trimmed : `${trimmed}/api`
}

function fieldMap(value) {
  if (!value) return undefined
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}

export function loadConfig(env = process.env) {
  return {
    port: number(env.LEAD_SERVICE_PORT, 8787),
    allowedOrigins: (env.LEAD_ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
      .split(',').map((value) => value.trim()).filter(Boolean),
    base44ApiUrl: normalizeApiUrl(env.BASE44_API_URL || 'https://divergent-nexus-growth-hub.base44.app/api'),
    base44AppId: env.BASE44_APP_ID || '',
    base44Key: env.BASE44_API_KEY || '',
    base44Entity: env.BASE44_ENTITY || 'ProspectLead',
    base44StageField: env.BASE44_STAGE_FIELD || 'pipeline_stage',
    base44Stage: env.BASE44_NEW_LEAD_STAGE || 'new',
    base44StatusField: env.BASE44_STATUS_FIELD || 'status',
    base44Status: env.BASE44_NEW_LEAD_STATUS || 'found',
    base44LeadSource: env.BASE44_LEAD_SOURCE || 'website',
    base44Owner: env.BASE44_LEAD_OWNER || 'Daniel Michaelis',
    base44OwnerEmail: env.BASE44_LEAD_OWNER_EMAIL || 'daniel@wavefrontstudiostaff.com',
    base44TimeoutMs: number(env.BASE44_TIMEOUT_MS, 10_000),
    base44FieldMap: fieldMap(env.BASE44_FIELD_MAP),
  }
}
