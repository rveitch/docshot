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
app.set('view engine', 'ejs');

/******************************** EXPRESS ROUTES ******************************/

// Default Endpoint
app.get('/', function (req, res) {
	res.render('index');
});


// Screenshot
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
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--allow-http-screen-capture', '--allow-insecure-localhost', '--allow-running-insecure-content', '--allow-http-background-page', '--allow-failed-policy-fetch-for-test', '--allow-external-pages'],
        dumpio: true
      });
      console.log('browser ready');

      const page = await browser.newPage();
      await page.setViewport({width: 1280, height: 1024, deviceScaleFactor: 1});
      await page.goto(targetUrl, {waitUntil: 'networkidle'});

      var innerHeight = await page.evaluate(_ => {return window.innerHeight});
      var height = await page.evaluate(_ => {return document.body.clientHeight});

      await page.screenshot({
        path: filePath,
        fullPage: true,
      });
      browser.close();

      res.download(filePath, fileName);
    } catch (e) {
      browser.close();
      res.json({error: e.message});
    }
  })();
});


// PDF
app.post('/getpdf', function (req, res) {
  const reqUrl = req.body.url;
  var i;
  (async () => {
    try {
      var parsedUrl = parseURL(reqUrl);
      var targetUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
      var timestamp = moment(Date.now()).format('MM_DD_YYYY__h_mm_ss_a');
      var fileName = `${parsedUrl.hostname}_${timestamp}.pdf`;
      var filePath = `./pdfs/${fileName}`;

      const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        dumpio: true
      });
      const page = await browser.newPage();

      await page.setViewport({
        width: 1440, // 1280
        height: 900, // 1024
        deviceScaleFactor: 1,
      });
      await console.log(page.viewport());
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
      browser.close();
      res.json({error: e.message});
    }
  })();
});

/******************************** HELPER FUNCTIONS ****************************/

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
  return URL.parse(`http://${url}`);
}

/******************************** SERVER LISTEN *******************************/

// Server Listen
app.listen( port, function () {
  console.log( `\nApp server is running on ${root_url}:${port}\n` );
});
