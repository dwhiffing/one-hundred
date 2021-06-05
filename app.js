const express = require('express')
const Scraper = require('images-scraper')
const google = new Scraper({
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
})
const app = express()
const port = process.env.PORT || 3000
const ExpressCache = require('express-cache-middleware')
const cacheManager = require('cache-manager')

const cacheMiddleware = new ExpressCache(
  cacheManager.caching({
    store: 'memory',
    max: 100000000,
    ttl: 3600,
  }),
)

cacheMiddleware.attach(app)

app.get('/*', (req, res) => {
  const path = req.params['0']

  if (!path) {
    return res.send('<p>Add a search term to the url (onehund.red/dogs)</p>')
  }

  google.scrape(path, 100).then((results) => {
    let resp =
      '<style>body { margin: 0;} img {width: 20%; object-fit: cover; height: 20vw;} </style>'
    resp += results
      .map((f) => f.url)
      .reduce((sum, t) => sum + `<img src="${t}"  />`, '')
    res.send(resp)
  })
})

app.listen(port, () => {
  // console.log()
})
