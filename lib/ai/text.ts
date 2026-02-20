import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are a concise writing assistant for film and media professionals using Pitchcraft, a pitch-building tool.

Your voice: professional, direct, film-industry standard. No flowery language, no filler, no marketing speak.

Rules:
- Keep the creator's intent intact. Refine, don't rewrite from scratch.
- Match the tone of the project (drama vs comedy vs documentary).
- Be concise. Industry professionals read fast.
- Never add clichés ("a gripping tale", "in a world where...").
- Never add content the creator didn't imply.
- Return ONLY the refined/drafted text. No preamble, no explanation, no quotes around it.`

interface TextAssistContext {
  projectName?: string
  genre?: string
  format?: string
  logline?: string
}

function buildContextBlock(ctx: TextAssistContext): string {
  const parts: string[] = []
  if (ctx.projectName) parts.push(`Project: ${ctx.projectName}`)
  if (ctx.genre) parts.push(`Genre: ${ctx.genre}`)
  if (ctx.format) parts.push(`Format: ${ctx.format}`)
  if (ctx.logline) parts.push(`Logline: ${ctx.logline}`)

  return parts.length > 0
    ? `Project context:\n${parts.join('\n')}\n\n`
    : ''
}

export async function refineText(
  text: string,
  fieldName: string,
  context: TextAssistContext
): Promise<string> {
  const contextBlock = buildContextBlock(context)

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `${contextBlock}Field: ${fieldName}\n\nRefine this text — improve clarity, tone, and conciseness while preserving the creator's intent:\n\n${text}`,
      },
    ],
  })

  const block = message.content[0]
  if (block.type === 'text') return block.text
  return text
}

export async function draftText(
  brief: string,
  fieldName: string,
  context: TextAssistContext
): Promise<string> {
  const contextBlock = buildContextBlock(context)

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `${contextBlock}Field: ${fieldName}\n\nDraft text based on this brief from the creator. Write a first draft they can edit:\n\n${brief}`,
      },
    ],
  })

  const block = message.content[0]
  if (block.type === 'text') return block.text
  return ''
}
