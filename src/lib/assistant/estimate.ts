import { createServerFn } from '@tanstack/react-start'

const MAX_DESCRIPTION_LENGTH = 1500
const MODEL = 'claude-sonnet-5'

const ESTIMATE_SYSTEM_PROMPT = `You are Vizualabs' project scope assistant — a public tool that gives website visitors an instant, honest read on a software project idea, live, to demonstrate the studio's AI and engineering competence.

Given a short project description, respond with a compact, well-formatted read covering:
1. **Complexity** — Simple / Moderate / Complex / Enterprise, with one sentence on why.
2. **Rough timeline** — a realistic range (e.g. "6-10 weeks"), never a single exact number.
3. **Key technical considerations** — 2-4 short bullet points on what would actually shape the build (integrations, data, scale, compliance, etc.).
4. **Suggested first step** — one concrete, small next action.

Rules:
- Never quote an exact price or dollar figure — costs depend on a real conversation, say so briefly if asked.
- Be specific to what they described, not generic boilerplate — reference details they actually gave you.
- Keep the whole response under 180 words. No preamble, no "Here's your estimate" framing — start directly with the complexity line.
- If the description is too vague to say anything useful, ask ONE specific clarifying question instead of guessing.
- Plain text with markdown-style **bold** for labels and "- " bullets only. No headers, no code blocks.`

export const estimateProject = createServerFn({ method: 'POST' })
  .validator((data: { description: string }) => data)
  .handler(async ({ data }) => {
    const description = data.description?.trim().slice(0, MAX_DESCRIPTION_LENGTH)
    if (!description) {
      return { ok: false as const, error: 'Describe your project first.' }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return {
        ok: false as const,
        error:
          "The instant estimator isn't fully configured yet. Send us the details through the contact form instead and we'll get back to you.",
      }
    }

    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: ESTIMATE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: description }],
    })

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim()

    if (!text) {
      return { ok: false as const, error: 'Something went wrong generating that read. Please try again.' }
    }

    return { ok: true as const, estimate: text }
  })

export const requestWrittenBrief = createServerFn({ method: 'POST' })
  .validator((data: { email: string; description: string; estimate: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email?.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false as const, error: "That email address doesn't look right." }
    }

    const { sendLeadEmail } = await import('../leads')
    const result = await sendLeadEmail({
      name: email.split('@')[0],
      email,
      subject: 'Instant estimate follow-up',
      message: data.description?.slice(0, 1500) || '',
      source: 'estimator',
      extra: [{ label: 'AI read given', value: data.estimate?.slice(0, 1500) || '' }],
    })

    if (!result.ok) {
      return {
        ok: false as const,
        error:
          result.reason === 'not_configured'
            ? "That isn't wired up yet — please email us directly instead."
            : 'Something went wrong sending that. Please try emailing us directly instead.',
      }
    }

    return { ok: true as const }
  })
