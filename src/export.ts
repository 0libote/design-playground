import { strToU8, zipSync } from 'fflate'

export type Palette = {
  id: string
  name: string
  background: string
  foreground: string
  accent: string
  soft: string
}

export type FontPair = {
  id: string
  name: string
  heading: string
  body: string
  label: string
  note: string
}

export type MotionSetting = {
  id: 'still' | 'calm' | 'kinetic'
  name: string
  duration: number
  note: string
}

export type TemplateName = 'editorial' | 'commerce' | 'portfolio'
export type PackConfig = { palette: Palette; font: FontPair; template: TemplateName; motion: MotionSetting }

export function buildDesignMarkdown({ palette, font, template, motion }: PackConfig) {
  return `# Design Direction: ${palette.name} / ${font.name}

## Intent

A ${template} direction using ${palette.name.toLowerCase()} colour, ${font.name.toLowerCase()} typography, and ${motion.name.toLowerCase()} motion.

## Colour palette

| Role | Value | Use |
| --- | --- | --- |
| Background | ${palette.background} | Page and quiet surfaces |
| Foreground | ${palette.foreground} | Primary text and strong controls |
| Accent | ${palette.accent} | Calls to action, focus, and emphasis |
| Soft | ${palette.soft} | Supporting surfaces and imagery |

## Typography

- Heading: \`${font.heading}\`
- Body: \`${font.body}\`
- Character: ${font.note}
- Keep display lines short and use body copy at a comfortable 1.5 line-height.

## Layout

- Starting template: ${template}
- Use a clear content grid with one dominant visual or message per section.
- Collapse multi-column layouts to one column below 768px.
- Keep the primary action visible and labels concrete.

## Motion

- Direction: ${motion.name}
- Base duration: ${motion.duration}ms
- Purpose: ${motion.note}
- Animate opacity and transforms only.
- Respect \`prefers-reduced-motion\`.

## Accessibility

- Verify text contrast after changing any colour token.
- Preserve visible focus states and keyboard order.
- Provide useful alternative text for content images.
- Never use colour as the only indicator of state.
`
}

export function buildTokens({ palette, font, motion }: PackConfig) {
  return `:root {
  --color-background: ${palette.background};
  --color-foreground: ${palette.foreground};
  --color-accent: ${palette.accent};
  --color-soft: ${palette.soft};
  --font-heading: ${font.heading};
  --font-body: ${font.body};
  --motion-duration: ${motion.duration}ms;
  --motion-ease: cubic-bezier(.16, 1, .3, 1);
  --radius: 12px;
}

body {
  margin: 0;
  color: var(--color-foreground);
  background: var(--color-background);
  font-family: var(--font-body);
}

h1, h2, h3 {
  font-family: var(--font-heading);
  letter-spacing: -.04em;
}
`
}

export function buildMotionCss({ motion }: PackConfig) {
  const distance = motion.id === 'kinetic' ? 24 : 10
  return `.reveal {
  animation: reveal var(--motion-duration) var(--motion-ease) both;
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(${distance}px); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
`
}

export function downloadDesignMarkdown(config: PackConfig) {
  downloadText(buildDesignMarkdown(config), 'DESIGN.md', 'text/markdown')
}

export function downloadTokens(config: PackConfig) {
  downloadText(buildTokens(config), 'tokens.css', 'text/css')
}

export async function downloadBoard(config: PackConfig) {
  downloadBlob(await makeBoard(config), 'palette-and-type.png')
}

export async function downloadDesignPack(config: PackConfig) {
  const [board, editorial, commerce, portfolio] = await Promise.all([
    makeBoard(config),
    makeExample(config, 'editorial'),
    makeExample(config, 'commerce'),
    makeExample(config, 'portfolio'),
  ])
  const files = {
    'DESIGN.md': strToU8(buildDesignMarkdown(config)),
    'tokens.css': strToU8(buildTokens(config)),
    'motion.css': strToU8(buildMotionCss(config)),
    'README.txt': strToU8('Open DESIGN.md first. Copy tokens.css and motion.css into your project, then use the PNG files as visual references.'),
    'palette-and-type.png': await bytes(board),
    'examples/editorial.png': await bytes(editorial),
    'examples/commerce.png': await bytes(commerce),
    'examples/portfolio.png': await bytes(portfolio),
  }
  const archive = zipSync(files, { level: 0 })
  downloadBlob(new Blob([archive], { type: 'application/zip' }), `${slug(config.palette.name)}-design-pack.zip`)
}

async function bytes(blob: Blob) {
  return new Uint8Array(await blob.arrayBuffer())
}

function downloadText(value: string, name: string, type: string) {
  downloadBlob(new Blob([value], { type }), name)
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function makeBoard(config: PackConfig) {
  return canvasBlob(1600, 1000, (context) => {
    const { palette, font, template, motion } = config
    context.fillStyle = palette.background
    context.fillRect(0, 0, 1600, 1000)
    context.fillStyle = palette.foreground
    context.font = `700 28px ${font.body}`
    context.fillText('DESIGN DIRECTION', 90, 92)
    context.font = `700 86px ${font.heading}`
    context.fillText(palette.name, 90, 200)
    context.font = `400 30px ${font.body}`
    context.fillText(`${font.name}  /  ${template}  /  ${motion.name} motion`, 94, 252)

    const colours = [
      ['Background', palette.background],
      ['Foreground', palette.foreground],
      ['Accent', palette.accent],
      ['Soft', palette.soft],
    ]
    colours.forEach(([label, colour], index) => {
      const x = 90 + index * 355
      context.fillStyle = colour
      context.fillRect(x, 330, 315, 250)
      context.fillStyle = readable(colour)
      context.font = `700 22px ${font.body}`
      context.fillText(label, x + 24, 526)
      context.font = `400 19px ${font.body}`
      context.fillText(colour.toUpperCase(), x + 24, 554)
    })

    context.fillStyle = palette.foreground
    context.font = `700 62px ${font.heading}`
    context.fillText('The quick brown fox', 90, 700)
    context.font = `400 25px ${font.body}`
    context.fillText('Heading', 94, 748)
    context.fillText(font.heading, 280, 748)
    context.fillText('Body', 94, 796)
    context.fillText(font.body, 280, 796)
    context.fillText('Motion', 94, 844)
    context.fillText(`${motion.name}, ${motion.duration}ms, ${motion.note}`, 280, 844)
    context.fillStyle = palette.accent
    context.fillRect(90, 902, 1420, 8)
  })
}

async function makeExample(config: PackConfig, template: TemplateName) {
  return canvasBlob(1440, 900, (context) => {
    const { palette, font } = config
    context.fillStyle = palette.background
    context.fillRect(0, 0, 1440, 900)
    context.fillStyle = palette.foreground
    context.font = `700 24px ${font.heading}`
    context.fillText(template === 'editorial' ? 'THE COMMON ROOM' : template === 'commerce' ? 'FORM OBJECTS' : 'MARA STUDIO', 70, 70)
    context.font = `400 18px ${font.body}`
    context.fillText('Work       About       Enquire', 1050, 70)
    context.fillStyle = mix(palette.foreground, palette.background, .76)
    context.fillRect(70, 104, 1300, 2)
    context.fillStyle = palette.accent
    context.font = `700 18px ${font.body}`
    context.fillText(template.toUpperCase(), 70, 162)
    context.fillStyle = palette.foreground
    context.font = `700 ${template === 'portfolio' ? 78 : 92}px ${font.heading}`
    const title = template === 'editorial' ? 'Ideas for better places.' : template === 'commerce' ? 'Objects with a quiet purpose.' : 'Clear ideas, impossible to ignore.'
    wrapText(context, title, 70, 260, 920, 94)

    if (template === 'editorial') {
      block(context, 70, 500, 820, 270, palette.soft)
      block(context, 940, 500, 430, 110, mix(palette.accent, palette.background, .35))
      block(context, 940, 660, 430, 110, mix(palette.foreground, palette.background, .12))
    } else if (template === 'commerce') {
      block(context, 820, 180, 550, 390, mix(palette.accent, palette.soft, .48))
      ;[70, 520, 970].forEach((x, index) => block(context, x, 650, 400, 170, index === 1 ? mix(palette.accent, palette.background, .24) : palette.soft))
    } else {
      block(context, 70, 470, 760, 350, palette.soft)
      block(context, 870, 470, 500, 160, mix(palette.accent, palette.background, .34))
      block(context, 870, 660, 500, 160, mix(palette.foreground, palette.background, .14))
    }
  })
}

function canvasBlob(width: number, height: number, draw: (context: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable')
  draw(context)
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Image export failed')), 'image/png'))
}

function block(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, colour: string) {
  context.fillStyle = colour
  context.beginPath()
  context.roundRect(x, y, width, height, 12)
  context.fill()
}

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  for (const word of words) {
    const next = `${line}${word} `
    if (context.measureText(next).width > width && line) {
      context.fillText(line, x, y)
      line = `${word} `
      y += lineHeight
    } else line = next
  }
  context.fillText(line, x, y)
}

function readable(hex: string) {
  const [r, g, b] = rgb(hex)
  return (r * 299 + g * 587 + b * 114) / 1000 > 145 ? '#171815' : '#f5f4ef'
}

function mix(first: string, second: string, weight: number) {
  const a = rgb(first)
  const b = rgb(second)
  return `#${a.map((channel, index) => Math.round(channel * weight + b[index]! * (1 - weight)).toString(16).padStart(2, '0')).join('')}`
}

function rgb(hex: string) {
  const value = hex.replace('#', '')
  return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16))
}
