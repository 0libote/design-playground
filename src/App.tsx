import { useState, type CSSProperties } from 'react'
import {
  downloadBoard,
  downloadDesignMarkdown,
  downloadDesignPack,
  downloadTokens,
  motionPresets,
  type FontPair,
  type PackConfig,
  type Palette,
  type TemplateName,
} from './export'
import './App.css'

const palettes: Palette[] = [
  { id: 'signal', name: 'Signal', background: '#f3f1ea', foreground: '#20211d', accent: '#dc5b32', soft: '#d5ddc7' },
  { id: 'cobalt', name: 'Cobalt', background: '#eff2f8', foreground: '#121b32', accent: '#2854c5', soft: '#bdcee9' },
  { id: 'forest', name: 'Forest', background: '#edf0e7', foreground: '#17231b', accent: '#2f6b4f', soft: '#c8a66a' },
  { id: 'carbon', name: 'Carbon', background: '#191a18', foreground: '#f0eee7', accent: '#d5ff52', soft: '#3c4038' },
  { id: 'lavender', name: 'Lavender', background: '#f1effa', foreground: '#211b38', accent: '#6a4fb3', soft: '#d8cff2' },
  { id: 'rosewood', name: 'Rosewood', background: '#f7eff1', foreground: '#301820', accent: '#a83f5c', soft: '#e5bdc8' },
  { id: 'tide', name: 'Tide', background: '#eaf4f3', foreground: '#15302e', accent: '#16766d', soft: '#b9dad6' },
  { id: 'sorbet', name: 'Sorbet', background: '#fff3ec', foreground: '#34211a', accent: '#d4552e', soft: '#f2c9b5' },
  { id: 'clay', name: 'Clay slate', background: '#ecefeb', foreground: '#202825', accent: '#a94f35', soft: '#b8c5c0' },
  { id: 'solar', name: 'Solar', background: '#f8f3d7', foreground: '#28240d', accent: '#a96900', soft: '#e7d36e' },
  { id: 'ice', name: 'Ice', background: '#edf6fa', foreground: '#132a36', accent: '#25769b', soft: '#bfdce8' },
  { id: 'night-rose', name: 'Night rose', background: '#1d1820', foreground: '#f5edf4', accent: '#f071a1', soft: '#4a3040' },
  { id: 'newsprint', name: 'Newsprint', background: '#f1f0eb', foreground: '#191919', accent: '#4b4b4b', soft: '#d1cfc5' },
  { id: 'mint', name: 'Mint', background: '#eff8ef', foreground: '#16351b', accent: '#3b7f49', soft: '#c8e5cc' },
]

const fonts: FontPair[] = [
  { id: 'swiss', name: 'Swiss utility', heading: 'Arial, Helvetica, sans-serif', body: 'Arial, Helvetica, sans-serif', label: 'Aa', note: 'Clear, direct, adaptable' },
  { id: 'editorial', name: 'Editorial contrast', heading: 'Georgia, Times New Roman, serif', body: 'Arial, Helvetica, sans-serif', label: 'Ag', note: 'Expressive, considered, literary' },
  { id: 'humanist', name: 'Humanist warmth', heading: 'Trebuchet MS, sans-serif', body: 'Verdana, sans-serif', label: 'Rt', note: 'Friendly, open, readable' },
  { id: 'mono', name: 'Technical mono', heading: 'Courier New, monospace', body: 'Arial, Helvetica, sans-serif', label: 'Mm', note: 'Structured, precise, distinctive' },
  { id: 'system', name: 'System modern', heading: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', body: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', label: 'Sy', note: 'Native, fast, familiar' },
  { id: 'grotesk', name: 'Modern grotesk', heading: 'Avenir Next, Avenir, Helvetica Neue, sans-serif', body: 'Helvetica Neue, Arial, sans-serif', label: 'Gg', note: 'Polished, balanced, contemporary' },
  { id: 'geometric', name: 'Geometric display', heading: 'Century Gothic, Futura, sans-serif', body: 'Arial, Helvetica, sans-serif', label: 'Oo', note: 'Graphic, circular, confident' },
  { id: 'book', name: 'Classic book', heading: 'Palatino, Book Antiqua, serif', body: 'Palatino, Book Antiqua, serif', label: 'Bb', note: 'Measured, cultured, readable' },
  { id: 'fashion', name: 'Fashion contrast', heading: 'Didot, Bodoni 72, Times New Roman, serif', body: 'Helvetica Neue, Arial, sans-serif', label: 'Ff', note: 'Sharp, elegant, high contrast' },
  { id: 'rounded', name: 'Rounded friendly', heading: 'Arial Rounded MT Bold, Trebuchet MS, sans-serif', body: 'Trebuchet MS, sans-serif', label: 'Rr', note: 'Soft, playful, approachable' },
  { id: 'condensed', name: 'Condensed impact', heading: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif', body: 'Arial, Helvetica, sans-serif', label: 'Cn', note: 'Loud, compact, campaign-led' },
  { id: 'code', name: 'Code and copy', heading: 'Menlo, Monaco, Consolas, monospace', body: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', label: '<_', note: 'Technical, crisp, developer-led' },
]

const templates: { id: TemplateName; name: string; note: string }[] = [
  { id: 'editorial', name: 'Editorial', note: 'Stories and ideas' },
  { id: 'commerce', name: 'Commerce', note: 'Products and launches' },
  { id: 'portfolio', name: 'Portfolio', note: 'Projects and practice' },
]

function App() {
  const [palette, setPalette] = useState(palettes[0])
  const [font, setFont] = useState(fonts[0])
  const [template, setTemplate] = useState<TemplateName>('editorial')
  const [motion, setMotion] = useState(motionPresets[2])
  const [motionRun, setMotionRun] = useState(0)
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [exportStatus, setExportStatus] = useState('Ready to export')

  const config: PackConfig = { palette, font, template, motion }
  const previewStyle = {
    '--preview-bg': palette.background,
    '--preview-text': palette.foreground,
    '--preview-accent': palette.accent,
    '--preview-soft': palette.soft,
    '--preview-heading': font.heading,
    '--preview-body': font.body,
    '--preview-speed': `${motion.duration}ms`,
    '--preview-from': motion.transform,
    '--preview-ease': motion.ease,
    '--preview-stagger': `${motion.stagger}ms`,
    '--preview-opacity': motion.fromOpacity,
  } as CSSProperties

  function updateColour(key: 'background' | 'foreground' | 'accent') {
    return (value: string) => setPalette((current) => ({ ...current, id: 'custom', name: 'Custom', [key]: value }))
  }

  async function runExport(label: string, action: () => Promise<void> | void) {
    try {
      setExportStatus(`Building ${label}`)
      await action()
      setExportStatus(`${label} downloaded`)
    } catch {
      setExportStatus(`Could not build ${label}`)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Design Playground home">
          <span className="brand-mark" aria-hidden="true">DP</span>
          <span>Design Playground</span>
        </a>
        <div className="topbar-copy">
          <strong>Untitled direction</strong>
          <span>Changes save in this session</span>
        </div>
        <button className="top-export" onClick={() => runExport('design pack', () => downloadDesignPack(config))}>
          Export pack
        </button>
      </header>

      <main className="workspace" id="top">
        <aside className="controls" aria-label="Design controls">
          <div className="panel-intro">
            <span className="eyebrow">Build a direction</span>
            <h1>Find the combination that feels right.</h1>
            <p>Change the ingredients. The preview responds instantly.</p>
          </div>

          <details className="control-group" open>
            <summary>Colour</summary>
            <div className="palette-list">
              {palettes.map((item) => (
                <button
                  className="palette-option"
                  aria-pressed={palette.id === item.id}
                  key={item.id}
                  onClick={() => setPalette(item)}
                >
                  <span>{item.name}</span>
                  <span className="mini-swatches" aria-hidden="true">
                    {[item.background, item.foreground, item.accent, item.soft].map((colour) => (
                      <i key={colour} style={{ background: colour }} />
                    ))}
                  </span>
                </button>
              ))}
            </div>
            <div className="custom-colours">
              {(['background', 'foreground', 'accent'] as const).map((key) => (
                <label key={key}>
                  <span>{key}</span>
                  <input type="color" value={palette[key]} onChange={(event) => updateColour(key)(event.target.value)} />
                </label>
              ))}
            </div>
          </details>

          <details className="control-group" open>
            <summary>Type</summary>
            <div className="font-list">
              {fonts.map((item) => (
                <button
                  className="font-option"
                  aria-pressed={font.id === item.id}
                  key={item.id}
                  onClick={() => setFont(item)}
                >
                  <b style={{ fontFamily: item.heading }}>{item.label}</b>
                  <span><strong>{item.name}</strong><small>{item.note}</small></span>
                </button>
              ))}
            </div>
          </details>

          <details className="control-group" open>
            <summary>Direction</summary>
            <div className="direction-list">
              {templates.map((item) => (
                <button aria-pressed={template === item.id} key={item.id} onClick={() => setTemplate(item.id)}>
                  <strong>{item.name}</strong><small>{item.note}</small>
                </button>
              ))}
            </div>
          </details>

          <details className="control-group" open>
            <summary>Motion</summary>
            <div className="motion-list">
              {motionPresets.map((item) => (
                <button aria-pressed={motion.id === item.id} key={item.id} onClick={() => { setMotion(item); setMotionRun((current) => current + 1) }}>
                  <strong>{item.name}</strong><small>{item.note}</small>
                </button>
              ))}
            </div>
          </details>
        </aside>

        <section className="preview-area" aria-label="Live website preview">
          <div className="preview-toolbar">
            <div>
              <span>Live preview</span>
              <strong>{templates.find((item) => item.id === template)?.name}</strong>
            </div>
            <div className="preview-actions">
              <button className="replay-button" onClick={() => setMotionRun((current) => current + 1)}>Replay motion</button>
              <div className="viewport-toggle" aria-label="Preview size">
                <button aria-pressed={viewport === 'desktop'} onClick={() => setViewport('desktop')}>Desktop</button>
                <button aria-pressed={viewport === 'mobile'} onClick={() => setViewport('mobile')}>Mobile</button>
              </div>
            </div>
          </div>
          <div className={`preview-stage ${viewport}`}>
            <div className="site-preview" style={previewStyle} key={`${template}-${motion.id}-${motionRun}`}>
              {template === 'editorial' && <EditorialPreview />}
              {template === 'commerce' && <CommercePreview />}
              {template === 'portfolio' && <PortfolioPreview />}
            </div>
          </div>
        </section>

        <aside className="pack-panel" aria-label="Design pack summary">
          <div>
            <span className="eyebrow">Your design pack</span>
            <h2>{palette.name} / {font.name}</h2>
            <p>A practical handoff for recreating this direction.</p>
          </div>

          <details className="pack-section" open>
            <summary>Current choices</summary>
            <div className="receipt">
              <div className="receipt-swatches" aria-label="Selected palette">
                {[palette.background, palette.foreground, palette.accent, palette.soft].map((colour) => (
                  <span key={colour} style={{ background: colour }} title={colour} />
                ))}
              </div>
              <dl>
                <div><dt>Heading</dt><dd style={{ fontFamily: font.heading }}>{font.name}</dd></div>
                <div><dt>Template</dt><dd>{template}</dd></div>
                <div><dt>Motion</dt><dd>{motion.name}</dd></div>
              </dl>
            </div>
          </details>

          <details className="pack-section pack-contents" open>
            <summary>Inside the ZIP</summary>
            <div className="file-grid">
              <span>DESIGN.md</span><span>tokens.css</span><span>motion.css</span>
              <span>Design board PNG</span><span>3 example PNGs</span><span>Pack notes</span>
            </div>
          </details>

          <button className="download-primary" onClick={() => runExport('design pack', () => downloadDesignPack(config))}>
            <strong>Download ZIP</strong>
            <span>Complete handoff</span>
          </button>

          <div className="single-exports">
            <button onClick={() => runExport('DESIGN.md', () => downloadDesignMarkdown(config))}>DESIGN.md</button>
            <button onClick={() => runExport('tokens.css', () => downloadTokens(config))}>CSS tokens</button>
            <button onClick={() => runExport('design board', () => downloadBoard(config))}>Board PNG</button>
          </div>

          <output className="export-status">{exportStatus}</output>
        </aside>
      </main>
    </div>
  )
}

function PreviewNav({ name }: Readonly<{ name: string }>) {
  return <div className="demo-nav"><strong>{name}</strong><span>Work</span><span>About</span><span className="demo-button">Enquire</span></div>
}

function EditorialPreview() {
  return (
    <div className="demo-page editorial-demo">
      <PreviewNav name="The Common Room" />
      <main>
        <p className="demo-kicker">Independent journal</p>
        <h2>Ideas for better places.</h2>
        <div className="editorial-grid">
          <article className="lead-story"><div className="story-image" /><h3>The rooms that bring us back together</h3><p>How thoughtful spaces turn passing moments into lasting rituals.</p></article>
          <div className="story-list"><article><span>Culture</span><h3>A library for everyday objects</h3></article><article><span>Practice</span><h3>Why useful details age well</h3></article></div>
        </div>
      </main>
    </div>
  )
}

function CommercePreview() {
  return (
    <div className="demo-page commerce-demo">
      <PreviewNav name="Form Objects" />
      <main>
        <div className="shop-hero"><div><p className="demo-kicker">New collection</p><h2>Objects with a quiet purpose.</h2><span className="demo-button">Shop the edit</span></div><div className="product-hero"><span>Form 01</span></div></div>
        <div className="product-row"><article><div /><h3>Fold lamp</h3><p>£180</p></article><article><div /><h3>Contour vessel</h3><p>£95</p></article><article><div /><h3>Line tray</h3><p>£62</p></article></div>
      </main>
    </div>
  )
}

function PortfolioPreview() {
  return (
    <div className="demo-page portfolio-demo">
      <PreviewNav name="Mara Studio" />
      <main>
        <div className="portfolio-hero"><p className="demo-kicker">Brand and digital practice</p><h2>We make clear ideas feel impossible to ignore.</h2></div>
        <div className="project-grid"><article className="project-large"><div /><h3>North House</h3><span>Hospitality identity</span></article><article><div /><h3>Elsewhere</h3><span>Digital publication</span></article><article><div /><h3>Open Field</h3><span>Campaign system</span></article></div>
      </main>
    </div>
  )
}

export default App
