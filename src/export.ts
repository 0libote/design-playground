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
  id: string
  name: string
  duration: number
  note: string
  transform: string
  ease: string
  stagger: number
  fromOpacity: number
}

export type BrandProfile = {
  name: string
  tagline: string
  description: string
  email: string
}

export type TemplateName = 'editorial' | 'commerce' | 'portfolio'
export type PackConfig = { brand: BrandProfile; palette: Palette; font: FontPair; template: TemplateName; motion: MotionSetting }

const starterContent: Record<TemplateName, { eyebrow: string; cta: string; items: [string, string][] }> = {
  editorial: { eyebrow: 'Independent journal', cta: 'Read the stories', items: [['Culture', 'A room worth returning to'], ['Objects', 'Useful things, thoughtfully made'], ['Practice', 'Details that age well']] },
  commerce: { eyebrow: 'New collection', cta: 'Shop the collection', items: [['Lighting', 'Fold lamp'], ['Objects', 'Contour vessel'], ['Table', 'Line tray']] },
  portfolio: { eyebrow: 'Independent studio', cta: 'View selected work', items: [['Brand', 'North House'], ['Digital', 'Elsewhere'], ['Campaign', 'Open Field']] },
}

export const motionPresets: MotionSetting[] = [
  { id: 'still', name: 'Still', duration: 0, note: 'No automatic motion', transform: 'none', ease: 'linear', stagger: 0, fromOpacity: 1 },
  { id: 'fade', name: 'Fade', duration: 320, note: 'Quiet opacity reveal', transform: 'none', ease: 'ease-out', stagger: 0, fromOpacity: 0 },
  { id: 'lift', name: 'Lift', duration: 460, note: 'Soft upward entrance', transform: 'translateY(28px)', ease: 'cubic-bezier(.16, 1, .3, 1)', stagger: 45, fromOpacity: 0 },
  { id: 'left', name: 'From left', duration: 520, note: 'Directional slide in', transform: 'translateX(-48px)', ease: 'cubic-bezier(.16, 1, .3, 1)', stagger: 55, fromOpacity: 0 },
  { id: 'right', name: 'From right', duration: 520, note: 'Reverse directional slide', transform: 'translateX(48px)', ease: 'cubic-bezier(.16, 1, .3, 1)', stagger: 55, fromOpacity: 0 },
  { id: 'scale', name: 'Scale', duration: 480, note: 'Clean zoom into place', transform: 'scale(.9)', ease: 'cubic-bezier(.16, 1, .3, 1)', stagger: 40, fromOpacity: 0 },
  { id: 'pop', name: 'Pop', duration: 560, note: 'Springy product reveal', transform: 'translateY(18px) scale(.88)', ease: 'cubic-bezier(.34, 1.56, .64, 1)', stagger: 70, fromOpacity: 0 },
  { id: 'tilt', name: 'Tilt', duration: 600, note: 'Editorial angled entrance', transform: 'translateY(24px) rotate(-2deg)', ease: 'cubic-bezier(.16, 1, .3, 1)', stagger: 65, fromOpacity: 0 },
  { id: 'fold', name: 'Fold', duration: 620, note: 'Dimensional page reveal', transform: 'perspective(600px) rotateX(16deg) translateY(20px)', ease: 'cubic-bezier(.16, 1, .3, 1)', stagger: 70, fromOpacity: 0 },
  { id: 'stagger', name: 'Stagger', duration: 520, note: 'Sequenced content reveal', transform: 'translateY(30px)', ease: 'cubic-bezier(.16, 1, .3, 1)', stagger: 140, fromOpacity: 0 },
]

export function buildDesignMarkdown({ brand: rawBrand, palette, font, template, motion }: PackConfig) {
  const brand = readyBrand(rawBrand)
  return `# ${brand.name} Design System

> ${brand.tagline}

## Brand

- Name: ${brand.name}
- Tagline: ${brand.tagline}
- About: ${brand.description}
- Contact: ${brand.email}

## Direction

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
- Entrance transform: \`${motion.transform}\`
- Stagger: ${motion.stagger}ms
- Purpose: ${motion.note}
- Apply \`.motion-${motion.id}\` from \`motion.css\`. The file includes every preset in the library.
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
  --motion-ease: ${motion.ease};
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
  return `/* Selected preset: ${motion.name} */
${motionPresets.map((preset) => `.motion-${preset.id} {
  animation: motion-${preset.id} ${preset.duration}ms ${preset.ease} both;
  animation-delay: calc(var(--motion-order, 0) * ${preset.stagger}ms);
}

@keyframes motion-${preset.id} {
  from { opacity: ${preset.fromOpacity}; transform: ${preset.transform}; }
}`).join('\n\n')}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
`
}

export function buildStarterHtml({ brand: rawBrand, template, motion }: PackConfig) {
  const brand = readyBrand(rawBrand)
  const content = starterContent[template]
  const name = escapeHtml(brand.name)
  const tagline = escapeHtml(brand.tagline)
  const description = escapeHtml(brand.description)
  const email = escapeHtml(brand.email)
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <title>${name} | ${tagline}</title>
  <link rel="stylesheet" href="../tokens.css">
  <link rel="stylesheet" href="../motion.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body class="${template}">
  <header class="site-header">
    <a class="brand" href="#top">${name}</a>
    <nav aria-label="Primary navigation">
      <a href="#work">Work</a>
      <a href="#about">About</a>
      <a class="button" href="mailto:${email}">Contact</a>
    </nav>
  </header>
  <main id="top">
    <section class="hero motion-${motion.id}">
      <p class="eyebrow">${content.eyebrow}</p>
      <h1>${tagline}</h1>
      <p class="intro">${description}</p>
      <a class="button" href="#work">${content.cta}</a>
    </section>
    <section class="showcase" id="work" aria-labelledby="work-title">
      <h2 id="work-title">Selected work</h2>
      <div class="showcase-grid">
${content.items.map(([label, title], index) => `        <article style="--motion-order: ${index + 1}" class="motion-${motion.id}"><div class="visual" aria-hidden="true"></div><p>${label}</p><h3>${title}</h3></article>`).join('\n')}
      </div>
    </section>
    <section class="about" id="about" aria-labelledby="about-title">
      <h2 id="about-title">About ${name}</h2>
      <p>${description}</p>
      <a href="mailto:${email}">${email}</a>
    </section>
  </main>
  <footer><strong>${name}</strong><span>${tagline}</span></footer>
</body>
</html>
`
}

export function buildStarterCss() {
  return `* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { min-width: 320px; }
a { color: inherit; }
.site-header { min-height: 72px; display: flex; align-items: center; gap: 32px; padding: 0 clamp(20px, 5vw, 72px); border-bottom: 1px solid color-mix(in srgb, var(--color-foreground) 20%, transparent); }
.brand { margin-right: auto; font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; text-decoration: none; }
nav { display: flex; align-items: center; gap: 24px; }
nav a { font-size: .85rem; text-decoration: none; }
.button { display: inline-flex; width: fit-content; padding: 12px 18px; border-radius: var(--radius); background: var(--color-foreground); color: var(--color-background); font-weight: 800; text-decoration: none; }
main > section, footer { padding: clamp(64px, 10vw, 140px) clamp(20px, 7vw, 100px); }
.hero { min-height: calc(100dvh - 72px); display: grid; align-content: center; justify-items: start; }
.eyebrow { margin: 0 0 18px; color: var(--color-accent); font-size: .75rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
h1, h2, h3, p { margin-top: 0; }
h1 { max-width: 14ch; margin-bottom: 24px; font-size: clamp(3.3rem, 9vw, 8rem); line-height: .92; }
.intro { max-width: 54ch; margin-bottom: 30px; font-size: clamp(1rem, 1.8vw, 1.3rem); line-height: 1.55; }
.showcase { border-top: 1px solid color-mix(in srgb, var(--color-foreground) 20%, transparent); }
.showcase h2, .about h2 { max-width: 14ch; font-size: clamp(2.4rem, 5vw, 5rem); line-height: .95; }
.showcase-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 20px; margin-top: 56px; }
.showcase article { min-width: 0; }
.visual { aspect-ratio: 4 / 3; margin-bottom: 18px; border-radius: var(--radius); background: linear-gradient(145deg, var(--color-soft), color-mix(in srgb, var(--color-accent) 50%, var(--color-background))); }
.showcase article:first-child .visual { aspect-ratio: 4 / 5; }
.showcase article:nth-child(2) .visual { background: color-mix(in srgb, var(--color-accent) 28%, var(--color-background)); }
.showcase article:nth-child(3) .visual { background: color-mix(in srgb, var(--color-foreground) 12%, var(--color-background)); }
.showcase article p { margin-bottom: 7px; color: var(--color-accent); font-size: .75rem; font-weight: 800; }
.showcase article h3 { font-size: clamp(1.2rem, 2vw, 2rem); }
.about { display: grid; grid-template-columns: 1.2fr 1fr; gap: 10vw; border-top: 1px solid color-mix(in srgb, var(--color-foreground) 20%, transparent); }
.about p { max-width: 50ch; font-size: 1.1rem; line-height: 1.65; }
.about a { font-weight: 800; }
footer { display: flex; justify-content: space-between; gap: 24px; padding-top: 28px; padding-bottom: 28px; border-top: 1px solid color-mix(in srgb, var(--color-foreground) 20%, transparent); }
@media (max-width: 700px) {
  .site-header { min-height: 64px; gap: 16px; }
  nav { gap: 12px; }
  nav > a:not(.button) { display: none; }
  .hero { min-height: calc(100dvh - 64px); }
  .showcase-grid, .about { grid-template-columns: 1fr; }
  .showcase article:first-child .visual { aspect-ratio: 4 / 3; }
  footer { display: grid; }
}
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
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
    'README.txt': strToU8('Open DESIGN.md for the full brand direction. Open site/index.html in a browser for the editable starter site. The site uses tokens.css and motion.css from this pack.'),
    'site/index.html': strToU8(buildStarterHtml(config)),
    'site/styles.css': strToU8(buildStarterCss()),
    'palette-and-type.png': await bytes(board),
    'examples/editorial.png': await bytes(editorial),
    'examples/commerce.png': await bytes(commerce),
    'examples/portfolio.png': await bytes(portfolio),
  }
  const archive = zipSync(files, { level: 0 })
  downloadBlob(new Blob([archive], { type: 'application/zip' }), `${slug(readyBrand(config.brand).name)}-design-pack.zip`)
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

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

function readyBrand(brand: BrandProfile): BrandProfile {
  return {
    name: brand.name.trim() || 'Your Brand',
    tagline: brand.tagline.trim() || 'Your tagline goes here.',
    description: brand.description.trim() || 'Describe what you do and why it matters.',
    email: brand.email.trim() || 'hello@example.com',
  }
}

async function makeBoard(config: PackConfig) {
  return canvasBlob(1600, 1000, (context) => {
    const { brand: rawBrand, palette, font, template, motion } = config
    const brand = readyBrand(rawBrand)
    context.fillStyle = palette.background
    context.fillRect(0, 0, 1600, 1000)
    context.fillStyle = palette.foreground
    context.font = `700 28px ${font.body}`
    context.fillText('DESIGN DIRECTION', 90, 92)
    context.font = `700 70px ${font.heading}`
    wrapText(context, brand.name, 90, 190, 1420, 75)
    context.font = `400 30px ${font.body}`
    context.fillText(brand.tagline, 94, 285, 1400)
    context.font = `400 22px ${font.body}`
    context.fillText(`${palette.name}  /  ${font.name}  /  ${template}  /  ${motion.name} motion`, 94, 320)

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
    const { brand: rawBrand, palette, font } = config
    const brand = readyBrand(rawBrand)
    context.fillStyle = palette.background
    context.fillRect(0, 0, 1440, 900)
    context.fillStyle = palette.foreground
    context.font = `700 24px ${font.heading}`
    context.fillText(brand.name.toUpperCase(), 70, 70, 760)
    context.font = `400 18px ${font.body}`
    context.fillText('Work       About       Enquire', 1050, 70)
    context.fillStyle = mix(palette.foreground, palette.background, .76)
    context.fillRect(70, 104, 1300, 2)
    context.fillStyle = palette.accent
    context.font = `700 18px ${font.body}`
    context.fillText(template.toUpperCase(), 70, 162)
    context.fillStyle = palette.foreground
    context.font = `700 ${template === 'portfolio' ? 78 : 92}px ${font.heading}`
    wrapText(context, brand.tagline, 70, 260, 920, 94)

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
