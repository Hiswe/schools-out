'use strict'

if (!/^10\./.test(process.versions.node)) {
  throw new Error(
    'wrong node version. Should run on nodejs 10. See package.json#engines',
  )
}

// https://devcenter.heroku.com/articles/node-concurrency
const throng = require('throng')

const start = require('./server/index')

const WORKERS = process.env.WEB_CONCURRENCY || 1

throng({
  start: start,
  workers: WORKERS,
  lifetime: Infinity,
})
