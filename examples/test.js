const puppeteer = require('puppeteer');

(async() => {
 const browser = await puppeteer.launch({
   headless: true,
   ignoreHTTPSErrors: true,
   //executablePath: '/app/.apt/opt/google/chrome/chrome',
   args: ['--no-sandbox', '--disable-setuid-sandbox'],
   dumpio: true
 });
 const page = await browser.newPage();
 await page.goto('https://example.com');
 browser.close();
})();
