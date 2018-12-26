'use strict'

const Koa = require('koa')
const ip = require('ip')
const chalk = require('chalk')

const config = require('../config')
const services = require('../services')

module.exports = start

async function start() {
  const app = new Koa()

  //////
  // SERVER CONFIG
  //////

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
        `v${config.version}`,
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
      `v${config.version}`,
      `listening on port ${config.PORT}`,
      `on mode`,
      chalk.cyan(`production`),
    )
  }
}
