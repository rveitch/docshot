# Node-Puppeteer
Node app for interacting with headless chrome for {reasons}.

## Local Setup
- `$ git clone https://github.com/rveitch/docraptor-logs.git`
- `$ npm install`
- Copy `template.env.txt` and rename it to `.env`
- Add your local environment variable keys to the `.env` file and save it.
- Run `$ npm start` or `$ node app` to initialize the app.
- Visit http://localhost:3000 in your browser.


heroku create --buildpack https://github.com/heroku/heroku-buildpack-google-chrome

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

```
heroku config:set NODE_MODULES_CACHE=false
git commit -am 'rebuild' --allow-empty
git push heroku master
heroku config:unset NODE_MODULES_CACHE
```

cd node-projects/node-puppeteer

chrome --headless --disable-gpu --no-sandbox --dump-dom https://www.chromestatus.com/
$GOOGLE_CHROME_BIN --headless --disable-gpu --no-sandbox --dump-dom https://www.chromestatus.com/
