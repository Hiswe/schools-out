'use strict'

// make bigint into numbers
// https://github.com/sequelize/sequelize/issues/1774#issuecomment-126714889
const pg = require('pg')
pg.defaults.parseInt8 = true

const { debuglog } = require('util')
const Sequelize = require('sequelize')
// https://www.npmjs.com/package/sql-formatter
const { format } = require('sql-formatter')

const config = require('../config')

const log = debuglog(`api:db:query`)
const { Op } = Sequelize

// Aliases all operators to the equivalent Symbols
// see comment on the new connection
const operatorsAliases = {}
Object.entries(Op).forEach(([key, value]) => {
  operatorsAliases[`$${key}`] = value
})

const sequelize = new Sequelize(config.db.url, {
  logging: query => log(format(query, { method: 'sql' })),
  // remove sequelize deprecation warnings
  // https://github.com/sequelize/sequelize/issues/8417#issuecomment-341617577
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-security
  operatorsAliases,
})

module.exports = sequelize
