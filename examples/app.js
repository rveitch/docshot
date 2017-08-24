'use strict';
var dotenv = require('dotenv');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var moment = require('moment');
const URL = require('url');
const puppeteer = require('puppeteer');

dotenv.load();
var root_url = (process.env.ROOT_URL || 'http://localhost');
var port = Number(process.env.PORT || 3000);

/******************************** EXPRESS SETUP *******************************/

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('json spaces', 2);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set('view engine', 'ejs'); // Set Express's view engine to EJS

/******************************** EXPRESS ROUTES ******************************/
// Default Endpoint
app.get('/', function (req, res) {
	res.render('index'); // Render an HTML page from an .ejs template
});

app.get('/url', function (req, res) {
  var reqUrl = 'https://coschedule.com'
  var parsedUrl = parseURL(reqUrl);
  var targetUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

	res.json({targetUrl}); // Render an HTML page from an .ejs template
});

// PDF v1
app.post('/screenshotv1', function (req, res) {
  /*if (!req.query.url) {
    res.json({error: 'Must provide a url in the query params.'});
  }
  const reqUrl = req.query.url;*/
  //console.log(req.body);
  const reqUrl = req.body.url;


  (async () => {
    try {
      var parsedUrl = parseURL(reqUrl);
      var targetUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
      var timestamp = moment(Date.now()).format('MM_DD_YYYY__h_mm_ss_a'); // Screenshot_6_20_17__3_02_PM
      var fileName = `${parsedUrl.hostname}_${timestamp}.pdf`;
      var filePath = `./pdfs/${fileName}`;

      const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        //executablePath: '/app/.apt/opt/google/chrome/chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        dumpio: true
      });
      const page = await browser.newPage();
      await page.setViewport({width: 1280, height: 1024, deviceScaleFactor: 1});
      await page.goto(targetUrl, {waitUntil: 'networkidle'});
      //await page.pdf({path: 'hn.pdf', format: 'A4'});
      var innerHeight = await page.evaluate(_ => {return window.innerHeight}),
          height = await page.evaluate(_ => {return document.body.clientHeight});
      await console.log(page.viewport());
      await page.pdf({
        path: filePath,
        //scale: 1, // Defaults to 1
        //displayHeaderFooter: true, // Defaults to false
        printBackground: true, // Defaults to false
        //landscape: false, // Defaults to false
        //pageRanges: '', // Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages.
        format: 'Letter', // Paper format. If set, takes priority over width or height options. Defaults to 'Letter'. The format options are: Letter, Legal, Tabloid, Ledger, A0-A5.
        //width: '1425px',
        //height: null,
        //margin: { top: '', right: '', bottom: '', left: '' } // Paper margins, defaults to none. All possible units are: px, in, cm, mm
      });

      browser.close();
      res.download(filePath, fileName);
    } catch (e) {
      res.json({error: e.message});
    }
  })();
});

// Screenhot
app.post('/getscreenshot', function (req, res) {
  (async () => {
    try {
      var parsedUrl = parseURL(req.body.url);
      var targetUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
      var timestamp = moment(Date.now()).format('MM_DD_YYYY__h_mm_ss_a');
      var fileName = `${parsedUrl.hostname}_${timestamp}.png`;
      var filePath = `./screenshots/${fileName}`;

      const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        dumpio: true
      });
      console.log('browser ready');

      const page = await browser.newPage();
      await page.setViewport({width: 1280, height: 1024, deviceScaleFactor: 1});
      await page.goto(targetUrl, {waitUntil: 'networkidle'});
      console.log('Waiting for transfers...');
       await page.waitForNavigation({
       networkIdleTimeout: 15000,
       waitUntil: 'networkidle',
       });
       console.log('Done.');

      var innerHeight = await page.evaluate(_ => {return window.innerHeight});
      var height = await page.evaluate(_ => {return document.body.clientHeight});

      await console.log(page.viewport());
      await page.screenshot({
        path: filePath,
        fullPage: true,
      });
      browser.close();

      res.download(filePath, fileName);
    } catch (e) {
      res.json({error: e.message});
    }
  })();
});

// PDF-v2
app.post('/getpdf', function (req, res) {
  const reqUrl = req.body.url;
  var i;
  (async () => {
    try {
      var parsedUrl = parseURL(reqUrl);
      var targetUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
      var timestamp = moment(Date.now()).format('MM_DD_YYYY__h_mm_ss_a'); // Screenshot_6_20_17__3_02_PM
      var fileName = `${parsedUrl.hostname}_${timestamp}.pdf`;
      var filePath = `./pdfs/${fileName}`;

      const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        //executablePath: '/app/.apt/opt/google/chrome/chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        dumpio: true
      });
      const page = await browser.newPage();
      await page.setViewport({
        width: 1440, // 1280
        height: 900, // 1024
        deviceScaleFactor: 1,
      });
      await page.goto(targetUrl, { waitUntil: 'networkidle' });
      var innerHeight = await page.evaluate(_ => {
        return window.innerHeight;
      }), height = await page.evaluate(_ => {
        return document.body.clientHeight;
      });
      console.log('height: ', height);
      console.log('Initiating Scrolling...');
      for (i = 0; i < (height / innerHeight); i++) {
        page.evaluate(_ => {
          window.scrollBy(0, window.innerHeight);
        });
        await sleep(200);
        console.log(i);
      }
      console.log('Waiting for transfers...');
       await page.waitForNavigation({
       networkIdleTimeout: 15000,
       waitUntil: 'networkidle',
       });
       console.log('Done.');
      var height = await page.evaluate(() => {
        return document.body.clientHeight;
      });
      console.log('height: ', height);
      await page.pdf({
        path: filePath,
        width: '1280px',
        height: height + 'px',
        printBackground: true,
        pageRanges: '1-1'
      });
      browser.close();
      res.download(filePath, fileName);
    } catch (e) {
      res.json({error: e.message});
    }
  })();
});


function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}

function parseURL(url) {
  const parsedURL = URL.parse(url);
  if (parsedURL.protocol) {
    return parsedURL;
  }

  // else, attempt to make a legit url by prefixing known good protocol //
  return URL.parse(`http://${url}`);
}

/******************************** SERVER LISTEN *******************************/

// Server Listen
app.listen( port, function () {
  console.log( `\nApp server is running on ${root_url}:${port}\n` );
  // console.log('process.env:', process.env)
});
