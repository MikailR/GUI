import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const page = await browser.newPage()
page.on('pageerror', (e) => console.log('pageerror', e.message))
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:4919/', { waitUntil: 'networkidle0' })
await sleep(2800)
const sel = 'button.dicon[aria-label="Open About Mikail"]'
const count = () => page.$$eval('.win', (els) => els.length)
// A: puppeteer clickCount 2
await page.click(sel, { clickCount: 2 }); await sleep(400); console.log('A clickCount2 ->', await count())
// B: two rapid clicks
await page.click('button.dicon[aria-label="Open Writing"]'); await page.click('button.dicon[aria-label="Open Writing"]'); await sleep(400); console.log('B two clicks ->', await count())
// C: synthetic dblclick
await page.$eval('button.dicon[aria-label="Open Lab"]', (el) => el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))); await sleep(400); console.log('C dispatch dblclick ->', await count())
// D: select + Enter
await page.click('button.dicon[aria-label="Open Papers"]'); await page.keyboard.press('Enter'); await sleep(400); console.log('D enter ->', await count())
await page.screenshot({ path: '.smoke/dbg2.png' })
await browser.close()
