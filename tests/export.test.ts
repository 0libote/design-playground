import { describe, expect, test } from 'bun:test'
import { buildDesignMarkdown, buildMotionCss, buildStarterCss, buildStarterHtml, buildTokens, type PackConfig } from '../src/export'

const config: PackConfig = {
  brand: { name: 'North & Form', tagline: 'Objects for real life.', description: 'Small-run objects made to be used.', email: 'hello@northandform.example' },
  palette: { id: 'test', name: 'Test', background: '#ffffff', foreground: '#111111', accent: '#cc5533', soft: '#dddddd' },
  font: { id: 'test', name: 'Test Pair', heading: 'Georgia, serif', body: 'Arial, sans-serif', label: 'Aa', note: 'Readable' },
  template: 'editorial',
  motion: { id: 'lift', name: 'Lift', duration: 460, note: 'Soft feedback', transform: 'translateY(28px)', ease: 'ease-out', stagger: 45, fromOpacity: 0 },
}

describe('design pack files', () => {
  test('include the selected design tokens and accessibility guidance', () => {
    expect(buildDesignMarkdown(config)).toContain('# North & Form Design System')
    expect(buildDesignMarkdown(config)).toContain('Contact: hello@northandform.example')
    expect(buildDesignMarkdown(config)).toContain('| Accent | #cc5533 |')
    expect(buildDesignMarkdown(config)).toContain('prefers-reduced-motion')
    expect(buildTokens(config)).toContain('--font-heading: Georgia, serif;')
    expect(buildMotionCss(config)).toContain('Selected preset: Lift')
    expect(buildMotionCss(config)).toContain('.motion-stagger')
    expect(buildMotionCss(config)).toContain('translateY(28px)')
  })

  test('builds a branded, escaped starter site using the selected files', () => {
    const html = buildStarterHtml({ ...config, brand: { ...config.brand, name: 'North <Form>', tagline: 'Build "well"' } })
    expect(html).toContain('<title>North &lt;Form&gt; | Build &quot;well&quot;</title>')
    expect(html).toContain('href="../tokens.css"')
    expect(html).toContain('class="hero motion-lift"')
    expect(html).not.toContain('<title>North <Form>')
    expect(buildStarterCss()).toContain('@media (max-width: 700px)')
    expect(buildDesignMarkdown({ ...config, brand: { name: ' ', tagline: '', description: '', email: '' } })).toContain('# Your Brand Design System')
  })
})
