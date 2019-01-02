'use strict'

const ip = require('ip')
const chalk = require('chalk')
const Koa = require('koa')
const helmet = require('koa-helmet')
const bodyParser = require('koa-body')
const compress = require('koa-compress')
const json = require('koa-json')
const logger = require('koa-logger')
const cors = require('@koa/cors')

const config = require('../config')
const services = require('../services')
const apiRouter = require('./routes')

module.exports = start

async function start() {
  const app = new Koa()

  app.use(helmet())
  app.use(bodyParser())
  app.use(compress())
  app.use(json())

  //////
  // SERVER CONFIG
  //////

  //----- ERRORS

  // TODO: send validations errors
  // • 400 for input errors: SequelizeValidationError
  // • 409 for duplicate errors: SequelizeUniqueConstraintError
  // • https://stackoverflow.com/questions/3290182/rest-http-status-codes-for-failed-validation-or-invalid-duplicate
  app.use(async function handleApiError(ctx, next) {
    try {
      await next()
    } catch (err) {
      ctx.status = err.statusCode || err.status || 500
      const { status } = ctx
      const { message } = err
      // only log errors >= 500
      const s = (status / 100) | 0
      if (s > 4) {
        console.log(err.original ? err.original : err)
      }
      ctx.body = {
        error: true,
        status,
        message,
        // TODO: shouldn't send stacktrace on production environment
        stacktrace: err.stacktrace || err.stack || false,
      }
      ctx.app.emit(`error`, err, ctx)
    }
  })

  //----- MOUNT ROUTER TO APPLICATION

  app.use(logger())

  app.use(
    cors({
      credentials: true,
    }),
  )

  app.use(apiRouter.routes())
  app.use(apiRouter.allowedMethods())

  //----- LAUNCH THE MAGIC

  let areServicesReady = false

  try {
    await services.ready
    areServicesReady = true
  } catch (error) {
    console.log(chalk.red(`[APP] not launched – needed services errored`))
    console.log(error)
  }

  if (!areServicesReady) return

  require('../models')
  const server = app.listen(config.PORT, endInit)

  function endInit() {
    if (config.isDev) {
      console.log(
        chalk.green(`[API]`),
        `v${config.VERSION}`,
        `on mode`,
        chalk.yellow(`development`),
      )
      console.log(`     `, `http://localhost:${config.PORT}`)
      console.log(`     `, `http://127.0.0.1:${config.PORT}`)
      console.log(`     `, `http://${ip.address()}:${config.PORT}/`)
      return
    }
    console.log(
      chalk.green(`[API]`),
      `v${config.VERSION}`,
      `listening on port ${config.PORT}`,
      `on mode`,
      chalk.cyan(`production`),
    )
  }
}
