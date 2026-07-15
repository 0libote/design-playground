import { describe, expect, test } from 'bun:test'
import { buildDesignMarkdown, buildMotionCss, buildTokens, type PackConfig } from '../src/export'

const config: PackConfig = {
  palette: { id: 'test', name: 'Test', background: '#ffffff', foreground: '#111111', accent: '#cc5533', soft: '#dddddd' },
  font: { id: 'test', name: 'Test Pair', heading: 'Georgia, serif', body: 'Arial, sans-serif', label: 'Aa', note: 'Readable' },
  template: 'editorial',
  motion: { id: 'lift', name: 'Lift', duration: 460, note: 'Soft feedback', transform: 'translateY(28px)', ease: 'ease-out', stagger: 45, fromOpacity: 0 },
}

describe('design pack files', () => {
  test('include the selected design tokens and accessibility guidance', () => {
    expect(buildDesignMarkdown(config)).toContain('| Accent | #cc5533 |')
    expect(buildDesignMarkdown(config)).toContain('prefers-reduced-motion')
    expect(buildTokens(config)).toContain('--font-heading: Georgia, serif;')
    expect(buildMotionCss(config)).toContain('Selected preset: Lift')
    expect(buildMotionCss(config)).toContain('.motion-stagger')
    expect(buildMotionCss(config)).toContain('translateY(28px)')
  })
})
