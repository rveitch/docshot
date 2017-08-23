const puppeteer = require('puppeteer');

(async() => {

//const browser = await puppeteer.launch();
const browser = await puppeteer.launch({
  headless: true,
  ignoreHTTPSErrors: true,
  //executablePath: '/app/.apt/opt/google/chrome/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  dumpio: true
});
const page = await browser.newPage();
await page.goto('https://coschedule.com', {waitUntil: 'networkidle'}); // https://coschedule.com, https://s.codepen.io/rveitch/debug/awQEOr
let result = await page.content();
//console.log(result);

// Type our query into the search bar
//await page.type('puppeteer');
//await page.click('input[type="submit"]');

// Wait for the results to show up
//await page.waitForSelector('meta');

// Extract the results from the page
const ogMeta = await page.evaluate(() => {
  const og = {}
  og.title = document.querySelector('meta[property="og:title"]').getAttribute("content") || null;
  og.description = document.querySelector('meta[property="og:description"]').getAttribute("content") || null;
  og.url = document.querySelector('meta[property="og:url"]').getAttribute("content") || null;
  og.image = document.querySelector('meta[property="og:image"]').getAttribute("content") || null;

  return og;
});
//console.log(links.join('\n'));
console.log(ogMeta);
browser.close();

})();

// page.$(selector)
