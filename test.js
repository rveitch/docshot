const puppeteer = require('puppeteer');

(async() => {
 const browser = await puppeteer.launch({
   headless: true,
   executablePath: '/app/.apt/opt/google/chrome/chrome',
   dumpio: true,
   args: ['--no-sandbox', '--disable-setuid-sandbox']
 });
 //const page = await browser.newPage();
 //await page.goto('https://example.com');
 browser.close();
})();
