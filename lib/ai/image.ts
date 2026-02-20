import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ImageContext {
  projectName?: string
  genre?: string
  format?: string
  logline?: string
}

function buildSystemContext(ctx: ImageContext): string {
  const parts: string[] = []
  if (ctx.projectName) parts.push(`Project: ${ctx.projectName}`)
  if (ctx.genre) parts.push(`Genre: ${ctx.genre}`)
  if (ctx.format) parts.push(`Format: ${ctx.format}`)
  if (ctx.logline) parts.push(`Logline: ${ctx.logline}`)
  return parts.length > 0 ? parts.join('. ') + '.' : ''
}

export async function generateImage(
  prompt: string,
  fieldName: string,
  context: ImageContext
): Promise<{ url: string }> {
  const contextStr = buildSystemContext(context)

  const fullPrompt = [
    `Reference image for a ${context.genre || 'film'} project.`,
    contextStr,
    `For the "${fieldName}" section.`,
    `Creator's request: ${prompt}`,
    'Style: cinematic, professional, muted tones. No text overlays.',
  ]
    .filter(Boolean)
    .join(' ')

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: fullPrompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
  })

  const url = response.data?.[0]?.url
  if (!url) throw new Error('No image URL returned')

  return { url }
}
