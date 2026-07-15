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
  { id: 'editorial', name: 'Editorial contrast', heading: 'Georgia, "Times New Roman", serif', body: 'Arial, Helvetica, sans-serif', label: 'Ag', note: 'Expressive, considered, literary' },
  { id: 'humanist', name: 'Humanist warmth', heading: '"Trebuchet MS", sans-serif', body: 'Verdana, sans-serif', label: 'Rt', note: 'Friendly, open, readable' },
  { id: 'mono', name: 'Technical mono', heading: '"Courier New", monospace', body: 'Arial, Helvetica, sans-serif', label: 'Mm', note: 'Structured, precise, distinctive' },
  { id: 'system', name: 'System modern', heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', body: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', label: 'Sy', note: 'Native, fast, familiar' },
  { id: 'grotesk', name: 'Modern grotesk', heading: '"Avenir Next", Avenir, "Helvetica Neue", sans-serif', body: '"Helvetica Neue", Arial, sans-serif', label: 'Gg', note: 'Polished, balanced, contemporary' },
  { id: 'geometric', name: 'Geometric display', heading: '"Century Gothic", Futura, sans-serif', body: 'Arial, Helvetica, sans-serif', label: 'Oo', note: 'Graphic, circular, confident' },
  { id: 'book', name: 'Classic book', heading: 'Palatino, "Book Antiqua", serif', body: 'Palatino, "Book Antiqua", serif', label: 'Bb', note: 'Measured, cultured, readable' },
  { id: 'fashion', name: 'Fashion contrast', heading: 'Didot, "Bodoni 72", "Times New Roman", serif', body: '"Helvetica Neue", Arial, sans-serif', label: 'Ff', note: 'Sharp, elegant, high contrast' },
  { id: 'rounded', name: 'Rounded friendly', heading: '"Arial Rounded MT Bold", "Trebuchet MS", sans-serif', body: '"Trebuchet MS", sans-serif', label: 'Rr', note: 'Soft, playful, approachable' },
  { id: 'condensed', name: 'Condensed impact', heading: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif', body: 'Arial, Helvetica, sans-serif', label: 'Cn', note: 'Loud, compact, campaign-led' },
  { id: 'code', name: 'Code and copy', heading: 'Menlo, Monaco, Consolas, monospace', body: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', label: '<_', note: 'Technical, crisp, developer-led' },
]

const templates: { id: TemplateName; name: string; note: string }[] = [
  { id: 'editorial', name: 'Editorial', note: 'Stories and ideas' },
  { id: 'commerce', name: 'Commerce', note: 'Products and launches' },
  { id: 'portfolio', name: 'Portfolio', note: 'Projects and practice' },
]

type DemoPage = 'home' | 'index' | 'detail' | 'about'

const pageLabels: Record<DemoPage, string> = {
  home: 'Home',
  index: 'Index',
  detail: 'Detail',
  about: 'About',
}

type DemoProps = Readonly<{
  page: DemoPage
  onNavigate: (page: DemoPage) => void
}>

function App() {
  const [palette, setPalette] = useState(palettes[0])
  const [font, setFont] = useState(fonts[0])
  const [template, setTemplate] = useState<TemplateName>('editorial')
  const [motion, setMotion] = useState(motionPresets[2])
  const [motionRun, setMotionRun] = useState(0)
  const [demoPage, setDemoPage] = useState<DemoPage>('home')
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

  function chooseTemplate(nextTemplate: TemplateName) {
    setTemplate(nextTemplate)
    setDemoPage('home')
    setMotionRun((current) => current + 1)
  }

  function navigateDemo(page: DemoPage) {
    setDemoPage(page)
    setMotionRun((current) => current + 1)
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
                <button aria-pressed={template === item.id} key={item.id} onClick={() => chooseTemplate(item.id)}>
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
              <strong>{templates.find((item) => item.id === template)?.name} / {pageLabels[demoPage]}</strong>
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
            <div className={`site-preview motion-run-${motionRun % 2}`} style={previewStyle}>
              {template === 'editorial' && <EditorialPreview page={demoPage} onNavigate={navigateDemo} />}
              {template === 'commerce' && <CommercePreview page={demoPage} onNavigate={navigateDemo} />}
              {template === 'portfolio' && <PortfolioPreview page={demoPage} onNavigate={navigateDemo} />}
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

type PreviewNavProps = Readonly<{
  name: string
  indexLabel: string
  page: DemoPage
  onNavigate: (page: DemoPage) => void
  actionLabel: string
  actionNote?: string
  onAction?: () => void
}>

function PreviewNav({ name, indexLabel, page, onNavigate, actionLabel, actionNote, onAction }: PreviewNavProps) {
  return (
    <nav className="demo-nav" aria-label={`${name} preview navigation`}>
      <button className="demo-brand" onClick={() => onNavigate('home')}>{name}</button>
      <button aria-current={page === 'index' ? 'page' : undefined} onClick={() => onNavigate('index')}>{indexLabel}</button>
      <button aria-current={page === 'about' ? 'page' : undefined} onClick={() => onNavigate('about')}>About</button>
      <button className="demo-button" onClick={onAction ?? (() => onNavigate('about'))}>{actionLabel}{actionNote && <span>{actionNote}</span>}</button>
    </nav>
  )
}

function EditorialPreview({ page, onNavigate }: DemoProps) {
  const [topic, setTopic] = useState('All')
  const [saved, setSaved] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const stories = [
    ['Culture', 'The rooms that bring us back together', 'How thoughtful spaces turn passing moments into lasting rituals.'],
    ['Objects', 'A library for everyday objects', 'A collection built around the things we use without thinking.'],
    ['Practice', 'Why useful details age well', 'Designers on restraint, repair, and making less feel complete.'],
    ['Culture', 'The return of the neighbourhood table', 'New gathering places designed for unplanned conversations.'],
  ]
  const visibleStories = topic === 'All' ? stories : stories.filter(([storyTopic]) => storyTopic === topic)

  return (
    <div className="demo-page editorial-demo">
      <PreviewNav name="The Common Room" indexLabel="Stories" page={page} onNavigate={onNavigate} actionLabel="Subscribe" />
      <main>
        {page === 'home' && <>
          <div className="editorial-heading"><p className="demo-kicker">Independent journal</p><h2>Ideas for better places.</h2></div>
          <div className="editorial-grid">
            <button className="lead-story story-link" onClick={() => onNavigate('detail')}>
              <div className="story-image image-common-room" aria-hidden="true" />
              <span className="story-topic">Culture</span><h3>The rooms that bring us back together</h3><p>How thoughtful spaces turn passing moments into lasting rituals.</p>
            </button>
            <div className="story-list">
              {stories.slice(1, 3).map(([storyTopic, title]) => <button key={title} onClick={() => onNavigate('detail')}><span>{storyTopic}</span><h3>{title}</h3></button>)}
              <button className="text-link" onClick={() => onNavigate('index')}>Read all stories</button>
            </div>
          </div>
        </>}

        {page === 'index' && <>
          <header className="demo-page-heading"><p className="demo-kicker">Latest writing</p><h2>Stories worth keeping.</h2></header>
          <div className="filter-row" aria-label="Filter stories">
            {['All', 'Culture', 'Objects', 'Practice'].map((item) => <button key={item} aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>)}
          </div>
          <div className="story-index" aria-live="polite">
            {visibleStories.map(([storyTopic, title, summary], index) => <button key={title} className="story-index-item" onClick={() => onNavigate('detail')}>
              <span className={`story-thumbnail story-thumbnail-${index + 1}`} aria-hidden="true" /><span className="story-index-copy"><small>{storyTopic}</small><strong>{title}</strong><p>{summary}</p></span><i aria-hidden="true">Read</i>
            </button>)}
          </div>
        </>}

        {page === 'detail' && <article className="article-page">
          <button className="text-link back-link" onClick={() => onNavigate('index')}>Back to stories</button>
          <header><p className="demo-kicker">Culture</p><h2>The rooms that bring us back together</h2><p className="article-deck">The most memorable spaces make room for accident, repetition, and the comfort of seeing familiar faces.</p></header>
          <div className="article-image image-common-room" aria-label="Abstract interior study" />
          <div className="article-body"><p>Good shared rooms do not prescribe a single way to use them. They offer edges to lean on, tables that can grow, and enough warmth to make staying feel natural.</p><p>The details are often quiet: a generous threshold, a bench in the right patch of light, or a surface that becomes more beautiful through use.</p></div>
          <button className="save-button" aria-pressed={saved} onClick={() => setSaved((current) => !current)}>{saved ? 'Saved to reading list' : 'Save for later'}</button>
        </article>}

        {page === 'about' && <section className="editorial-about">
          <div><p className="demo-kicker">About the journal</p><h2>Curiosity, made useful.</h2><p>We publish stories about the spaces, objects, and rituals that shape daily life. New editions arrive twice a month.</p></div>
          {subscribed ? <div className="form-success" role="status"><strong>You are on the list.</strong><p>The next edition will arrive in your inbox.</p><button className="text-link" onClick={() => setSubscribed(false)}>Use another address</button></div> :
            <form className="demo-form" onSubmit={(event) => { event.preventDefault(); setSubscribed(true) }}>
              <label htmlFor="editorial-email">Email address</label><input id="editorial-email" type="email" required placeholder="you@example.com" />
              <small>Two thoughtful emails each month. Unsubscribe at any time.</small><button className="demo-button" type="submit">Join the journal</button>
            </form>}
        </section>}
      </main>
    </div>
  )
}

function CommercePreview({ page, onNavigate }: DemoProps) {
  const [category, setCategory] = useState('All')
  const [finish, setFinish] = useState('Chalk')
  const [bagCount, setBagCount] = useState(0)
  const [bagOpen, setBagOpen] = useState(false)
  const products = [
    ['Lighting', 'Fold lamp', '£180'], ['Objects', 'Contour vessel', '£95'], ['Table', 'Line tray', '£62'], ['Lighting', 'Arc light', '£240'],
  ]
  const visibleProducts = category === 'All' ? products : products.filter(([productCategory]) => productCategory === category)

  return (
    <div className="demo-page commerce-demo">
      <PreviewNav name="Form Objects" indexLabel="Shop" page={page} onNavigate={onNavigate} actionLabel="Bag" actionNote={`${bagCount}`} onAction={() => setBagOpen((current) => !current)} />
      {bagOpen && <aside className="bag-panel" aria-label="Shopping bag">
        <div><strong>Your bag</strong><button onClick={() => setBagOpen(false)} aria-label="Close bag">Close</button></div>
        {bagCount === 0 ? <p>Your bag is empty. Choose an object from the collection.</p> : <><div className="bag-line"><span className="bag-object" aria-hidden="true" /><span><strong>Fold lamp</strong><small>{finish} finish</small></span><b>£180</b></div><p>{bagCount} {bagCount === 1 ? 'item' : 'items'} ready for checkout.</p></>}
        <button className="demo-button" onClick={() => { setBagOpen(false); onNavigate('index') }}>{bagCount === 0 ? 'Browse objects' : 'Continue shopping'}</button>
      </aside>}
      <main>
        {page === 'home' && <>
          <div className="shop-hero"><div><p className="demo-kicker">New collection</p><h2>Objects with a quiet purpose.</h2><button className="demo-button" onClick={() => onNavigate('index')}>Shop the edit</button></div><button className="product-hero" onClick={() => onNavigate('detail')}><span>Form 01</span><i>View object</i></button></div>
          <div className="product-row">{products.slice(0, 3).map(([productCategory, name, price], index) => <button key={name} onClick={() => onNavigate('detail')}><span className={`product-image product-image-${index + 1}`} /><small>{productCategory}</small><h3>{name}</h3><p>{price}</p></button>)}</div>
        </>}

        {page === 'index' && <>
          <header className="demo-page-heading shop-heading"><p className="demo-kicker">The collection</p><h2>Made to be used.</h2></header>
          <div className="filter-row" aria-label="Filter products">{['All', 'Lighting', 'Objects', 'Table'].map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <div className="shop-grid" aria-live="polite">{visibleProducts.map(([productCategory, name, price], index) => <button key={name} onClick={() => onNavigate('detail')}><span className={`product-image product-image-${(index % 3) + 1}`} /><small>{productCategory}</small><strong>{name}</strong><i>{price}</i></button>)}</div>
        </>}

        {page === 'detail' && <section className="product-page">
          <button className="text-link back-link" onClick={() => onNavigate('index')}>Back to shop</button>
          <div className="product-detail-image"><span>Form 01</span></div>
          <div className="product-copy"><p className="demo-kicker">Portable light</p><h2>Fold lamp</h2><p className="product-price">£180</p><p>A compact, dimmable lamp with a folded aluminium shade and warm, even light.</p>
            <fieldset><legend>Finish</legend><div className="variant-row">{['Chalk', 'Cobalt', 'Carbon'].map((item) => <button type="button" key={item} aria-pressed={finish === item} onClick={() => setFinish(item)}>{item}</button>)}</div></fieldset>
            <button className="demo-button add-button" onClick={() => setBagCount((current) => current + 1)}>Add {finish} to bag</button>
            {bagCount > 0 && <p className="inline-feedback" role="status">Bag now contains {bagCount} {bagCount === 1 ? 'item' : 'items'}.</p>}
          </div>
        </section>}

        {page === 'about' && <section className="commerce-about"><div className="about-object" aria-hidden="true" /><div><p className="demo-kicker">Form follows living</p><h2>Useful things, carefully resolved.</h2><p>We work with independent makers to create small-run objects that earn their place at home.</p><dl><div><dt>Materials</dt><dd>Recycled aluminium, glass, FSC timber</dd></div><div><dt>Making</dt><dd>Small workshops across the UK</dd></div><div><dt>Promise</dt><dd>Repair support for every object</dd></div></dl></div></section>}
      </main>
    </div>
  )
}

function PortfolioPreview({ page, onNavigate }: DemoProps) {
  const [discipline, setDiscipline] = useState('All')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sent, setSent] = useState(false)
  const projects = [
    ['Brand', 'North House', 'Hospitality identity'], ['Digital', 'Elsewhere', 'Digital publication'], ['Campaign', 'Open Field', 'Cultural campaign'], ['Digital', 'Signal Archive', 'Research platform'],
  ]
  const visibleProjects = discipline === 'All' ? projects : projects.filter(([projectDiscipline]) => projectDiscipline === discipline)

  return (
    <div className="demo-page portfolio-demo">
      <PreviewNav name="Mara Studio" indexLabel="Work" page={page} onNavigate={onNavigate} actionLabel="Start a project" />
      <main>
        {page === 'home' && <>
          <div className="portfolio-hero"><p className="demo-kicker">Brand and digital practice</p><h2>We make clear ideas impossible to ignore.</h2><button className="text-link" onClick={() => onNavigate('index')}>View selected work</button></div>
          <div className="project-grid">{projects.slice(0, 3).map(([, name, type], index) => <button key={name} className={index === 0 ? 'project-large' : ''} onClick={() => onNavigate('detail')}><span className={`project-image project-image-${index + 1}`} /><h3>{name}</h3><small>{type}</small></button>)}</div>
        </>}

        {page === 'index' && <>
          <header className="demo-page-heading portfolio-heading"><p className="demo-kicker">Selected work</p><h2>Built for recognition.</h2></header>
          <div className="work-controls"><div className="filter-row" aria-label="Filter projects">{['All', 'Brand', 'Digital', 'Campaign'].map((item) => <button key={item} aria-pressed={discipline === item} onClick={() => setDiscipline(item)}>{item}</button>)}</div><div className="view-toggle" aria-label="Project view"><button aria-pressed={view === 'grid'} onClick={() => setView('grid')}>Grid</button><button aria-pressed={view === 'list'} onClick={() => setView('list')}>List</button></div></div>
          <div className={`work-index ${view}`} aria-live="polite">{visibleProjects.map(([, name, type], index) => <button key={name} onClick={() => onNavigate('detail')}><span className={`project-image project-image-${(index % 3) + 1}`} /><span><strong>{name}</strong><small>{type}</small></span><i>View case study</i></button>)}</div>
        </>}

        {page === 'detail' && <article className="case-study">
          <button className="text-link back-link" onClick={() => onNavigate('index')}>Back to work</button>
          <header><p className="demo-kicker">Hospitality identity</p><h2>North House</h2><p>A flexible identity built around the rhythm of a day beside the water.</p></header>
          <div className="case-hero project-image-1"><strong>NH</strong></div>
          <div className="case-facts"><div><span>Scope</span><p>Strategy, identity, digital</p></div><div><span>Approach</span><p>A changing mark and a calm editorial system</p></div><div><span>Outcome</span><p>One recognisable voice across every guest touchpoint</p></div></div>
          <button className="demo-button" onClick={() => onNavigate('about')}>Start a project</button>
        </article>}

        {page === 'about' && <section className="portfolio-about">
          <div><p className="demo-kicker">Small team, close work</p><h2>Strategy through launch, without the handoffs.</h2><p>We partner with thoughtful teams on brand systems, digital products, and campaigns.</p></div>
          {sent ? <div className="form-success dark-success" role="status"><strong>Brief received.</strong><p>We will reply within two working days.</p><button className="text-link" onClick={() => setSent(false)}>Send another</button></div> : <form className="demo-form" onSubmit={(event) => { event.preventDefault(); setSent(true) }}><label htmlFor="project-name">Your name</label><input id="project-name" required /><label htmlFor="project-email">Email address</label><input id="project-email" type="email" required /><label htmlFor="project-brief">What are you making?</label><textarea id="project-brief" required rows={3} /><button className="demo-button" type="submit">Send brief</button></form>}
        </section>}
      </main>
    </div>
  )
}

export default App
