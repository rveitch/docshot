# Node-Puppeteer
Node app for interacting with headless chrome for {reasons}.

## Local Setup
- `$ git clone https://github.com/rveitch/docraptor-logs.git`
- `$ npm install`
- Copy `template.env.txt` and rename it to `.env`
- Add your local environment variable keys to the `.env` file and save it.
- Run `$ npm start` or `$ node app` to initialize the app.
- Visit http://localhost:3000 in your browser.


heroku create --buildpack https://github.com/dwayhs/heroku-buildpack-chrome.git
https://elements.heroku.com/buildpacks/dwayhs/heroku-buildpack-chrome

## Procfile
```
web: /app/.apt/usr/bin/google-chrome & node app.js
```
/app/.apt/usr/bin/google-chrome: No such file or directory


```
const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    })
```
