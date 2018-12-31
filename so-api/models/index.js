'use strict'

const { debuglog } = require('util')
const chalk = require('chalk')

const config = require('../config')
const { sequelize } = require('../services')

const log = debuglog(`api:db`)

// MODELS

const School = require('./schools')
const User = require('./users')
const Teacher = require('./teachers')
const Room = require('./rooms')
const Lesson = require('./lessons')

//////
// RELATIONS
//////

School.hasMany(User)
School.hasMany(Teacher)
School.hasMany(Room)
School.hasMany(Lesson)

User.belongsTo(School)

Room.hasMany(Lesson)
Room.belongsTo(School)

Teacher.belongsTo(School)
Teacher.hasMany(Lesson)

Lesson.belongsTo(School)
Lesson.belongsTo(Teacher)
Lesson.belongsTo(Room)

// Quotation.belongsTo( User )
// Quotation.belongsTo( Customer )
// Quotation.belongsTo( ProductConfig )
// Quotation.belongsTo( QuotationConfig )
// Quotation.belongsTo( Invoice )

// Invoice.belongsTo( User )
// Invoice.belongsTo( Customer )
// Invoice.belongsTo( InvoiceConfig )
// Invoice.hasOne( Quotation )

// Customer.belongsTo( User )
// Customer.hasMany( Quotation )
// Customer.hasMany( Invoice )

// QuotationConfig.belongsTo( User )
// InvoiceConfig.belongsTo( User )
// ProductConfig.belongsTo( User )

// User.hasMany( Customer )
// User.hasMany( Quotation )
// User.hasMany( Invoice )
// User.hasOne( QuotationConfig )
// User.hasOne( InvoiceConfig )
// User.hasOne( ProductConfig )

//////
// SYNC DATABASE
//////

sequelize
  .authenticate()
  .then(async () => {
    log(chalk.green(`connection ok`))
    try {
      await sequelize.sync({ force: config.db.forceSync })
      log(chalk.green(`sync is done`))
    } catch (err) {
      console.log(chalk.red(`sync FAIL`))
      console.log(err)
    }
  })
  .catch(err => {
    console.log(chalk.red(`connection FAIL`))
    console.log(err)
    if (err.code !== `ECONNREFUSED`) return console.log(err)
    console.log(chalk.yellow(`db is not accessible\nlaunch it for god sake`))
  })

module.exports = {
  sequelize,
  School,
  User,
  Teacher,
  Room,
  Lesson,
}
