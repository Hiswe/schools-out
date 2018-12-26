'use strict'

const chalk = require('chalk')

const sequelize = require('./database-connection')

const DB_READY = new Promise((resolve, reject) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log(chalk.green(`[DATABASE]`), `connection ok`)
      resolve()
    })
    .catch(err => {
      console.log(chalk.red(`[DATABASE]`, `connection FAIL`))
      reject(`[DATABASE] connection failed`)
      console.log(err)
      if (err.code === `ECONNREFUSED`) {
        console.log(chalk.yellow(`[DATABASE] db is not accessible`))
      }
    })
})

const ready = Promise.all([DB_READY])

module.exports = {
  sequelize,
  ready,
}
