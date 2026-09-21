export const MODEL = 'gemini-3.6-flash'

export type GeminiPart = {
  text?: string
  functionCall?: { name?: string; args?: Record<string, unknown> }
  functionResponse?: {
    name: string
    response: Record<string, unknown>
  }
}

export type GeminiContent = {
  role: 'user' | 'model'
  parts: GeminiPart[]
}

type GenerateOptions = {
  apiKey: string
  contents: GeminiContent[]
  systemInstruction: string
  maxOutputTokens: number
  tools?: unknown[]
  responseMimeType?: string
  thinkingMinimal?: boolean
}

type GeminiResponse = {
  candidates?: Array<{
    content?: GeminiContent
  }>
}

export async function generateContent(options: GenerateOptions): Promise<GeminiResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(options.apiKey)}`

  const generationConfig: Record<string, unknown> = {
    maxOutputTokens: options.maxOutputTokens,
  }
  if (options.responseMimeType) {
    generationConfig.responseMimeType = options.responseMimeType
  }
  if (options.thinkingMinimal) {
    generationConfig.thinkingConfig = { thinkingLevel: 'MINIMAL' }
  }

  const body: Record<string, unknown> = {
    systemInstruction: { parts: [{ text: options.systemInstruction }] },
    contents: options.contents,
    generationConfig,
  }

  if (options.tools) {
    body.tools = options.tools
    // Handle tools ourselves in a single follow-up round (matches site createServerFn).
    body.toolConfig = {
      functionCallingConfig: { mode: 'AUTO' },
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 400)}`)
  }

  return (await res.json()) as GeminiResponse
}

export function extractText(response: GeminiResponse): string {
  const parts = response.candidates?.[0]?.content?.parts ?? []
  return parts
    .map((p) => p.text ?? '')
    .filter(Boolean)
    .join('\n')
    .trim()
}

export function extractFunctionCalls(
  response: GeminiResponse,
): Array<{ name: string; args: Record<string, unknown> }> {
  const parts = response.candidates?.[0]?.content?.parts ?? []
  const calls: Array<{ name: string; args: Record<string, unknown> }> = []
  for (const part of parts) {
    const name = part.functionCall?.name
    if (!name) continue
    calls.push({ name, args: part.functionCall?.args ?? {} })
  }
  return calls
}
