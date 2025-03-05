import puppeteer from 'puppeteer'

export default async function launchBrowser(userAgent) {
	const browser = await puppeteer.launch({
		headless: false,
	})
	const page = await browser.newPage()
	await page.setUserAgent(userAgent)
	const cookies = await page.cookies()
	await page.deleteCookie(...cookies)
	await page.setViewport({
		width: 1920,
		height: 1080,
		deviceScaleFactor: 1,
	})
	return { browser, page }
}
