import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--disable-gpu', '--use-gl=swiftshader'] })
const errors = []
const page = await browser.newPage()
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`) })
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' })
await sleep(2800)
await page.screenshot({ path: '.smoke/01-desktop.png' })

// open About via double click on desktop icon
const about = await page.$('button.dicon[aria-label="Open About Mikail"]')
const ab = await about.boundingBox()
await page.mouse.click(ab.x + ab.width / 2, ab.y + ab.height / 2, { clickCount: 2 })
await sleep(500)
// open Writing via dock, Lab via Cmd+4, terminal via spotlight
await page.click('[data-dock="writing"]'); await sleep(400)
await page.keyboard.down('Meta'); await page.keyboard.press('4'); await page.keyboard.up('Meta'); await sleep(400)
await page.keyboard.down('Meta'); await page.keyboard.press('k'); await page.keyboard.up('Meta'); await sleep(300)
await page.keyboard.type('neo'); await sleep(200)
await page.screenshot({ path: '.smoke/02-spotlight.png' })
await page.keyboard.press('Escape'); await sleep(200)
await page.keyboard.down('Meta'); await page.keyboard.press('k'); await page.keyboard.up('Meta'); await sleep(300)
await page.keyboard.type('term'); await sleep(200); await page.keyboard.press('Enter'); await sleep(600)
await page.keyboard.type('neofetch'); await page.keyboard.press('Enter'); await sleep(300)
await page.screenshot({ path: '.smoke/03-windows.png' })

// drag the focused (terminal) window by its title bar
const title = await page.$('.win.focused .win-titlebar')
const tb = await title.boundingBox()
await page.mouse.move(tb.x + tb.width / 2 + 60, tb.y + tb.height / 2)
await page.mouse.down(); await page.mouse.move(tb.x + 300, tb.y + 200, { steps: 8 }); await page.mouse.up(); await sleep(300)
const winCount = await page.$$eval('.win', (els) => els.map((e) => ({ l: e.style.left, t: e.style.top, z: e.style.zIndex, cls: e.className })))
console.log('windows', JSON.stringify(winCount))

// minimize with Cmd+M, restore from dock, close with Esc
await page.keyboard.down('Meta'); await page.keyboard.press('m'); await page.keyboard.up('Meta'); await sleep(500)
await page.screenshot({ path: '.smoke/04-minimized.png' })
await page.click('[data-dock="terminal"]'); await sleep(400)
await page.keyboard.press('Escape'); await sleep(300)
// lab window: hover dock to see magnification, screenshot
const dock = await page.$('.dock'); const db = await dock.boundingBox()
await page.mouse.move(db.x + db.width * 0.45, db.y + db.height / 2); await sleep(300)
await page.screenshot({ path: '.smoke/05-dock-hover.png' })
// theme toggle + horizon wallpaper + right-click desktop
await page.click('.mb-item[title="Toggle theme"]'); await sleep(300)
await page.mouse.click(400, 500, { button: 'right' }); await sleep(300)
await page.screenshot({ path: '.smoke/06-dawn-ctx.png' })
await page.keyboard.press('Escape'); await sleep(200)
// trash flow
await page.click('[data-dock="trash"]'); await sleep(500)
await page.screenshot({ path: '.smoke/07-trash.png' })
// maximize via green button
await page.click('.win.focused .traffic .max'); await sleep(500)
await page.screenshot({ path: '.smoke/08-max.png' })

// mobile
const m = await browser.newPage()
m.on('console', (x) => { if (x.type() === 'error') errors.push(`[mobile ${x.type()}] ${x.text()}`) })
m.on('pageerror', (e) => errors.push(`[mobile pageerror] ${e.message}`))
await m.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await m.goto('http://localhost:4173/', { waitUntil: 'networkidle0' })
await sleep(2800)
await m.screenshot({ path: '.smoke/m1-home.png' })
const icons = await m.$$('.m-grid .m-icon')
await icons[1].tap(); await sleep(600)
await m.screenshot({ path: '.smoke/m2-writing.png' })
const post = await m.$('.side-item'); await post.tap(); await sleep(400)
await m.screenshot({ path: '.smoke/m3-post.png' })
await icons[3] // lab
const dockIcons = await m.$$('.m-dock .m-icon'); await dockIcons[2].tap(); await sleep(700)
await m.screenshot({ path: '.smoke/m4-lab.png' })
await m.tap('.m-home-bar'); await sleep(500)
await m.screenshot({ path: '.smoke/m5-home-running.png' })

console.log('ERRORS', errors.length ? errors.join('\n') : 'none')
await browser.close()
