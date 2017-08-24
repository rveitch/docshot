# DocShot
Node app for interacting with headless chrome for {reasons}.

## Local Setup
- `$ git clone https://github.com/rveitch/docshot.git`
- `$ npm install`
- Copy `template.env.txt` and rename it to `.env`
- Add your local environment variable keys to the `.env` file and save it.
- Run `$ npm start` or `$ node app` to initialize the app.
- Visit http://localhost:3000 in your browser.

## Heroku
- `heroku create --buildpack https://github.com/heroku/heroku-buildpack-google-chrome`
