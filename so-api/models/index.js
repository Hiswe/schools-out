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
const Place = require('./places')
const Lesson = require('./lessons')
const Registration = require('./registrations')
const Rate = require('./rates')

//////
// RELATIONS
//////

School.hasMany(User)
School.hasMany(Teacher)
School.hasMany(Place)
School.hasMany(Lesson)
School.hasMany(Rate)

// TODO: a user can belong to many schools
User.belongsTo(School)
User.hasMany(Registration)

Place.hasMany(Lesson)
// TODO: a room can belong to many schools
Place.belongsTo(School)

Teacher.belongsTo(School)
Teacher.hasMany(Lesson)

Lesson.belongsTo(School)
Lesson.belongsTo(Teacher)
Lesson.belongsTo(Place)
Lesson.hasMany(Registration)

Rate.belongsTo(School)

Registration.belongsTo(School)
Registration.belongsTo(User)
Registration.belongsTo(Lesson)
Registration.belongsTo(Rate)

//////
// SYNC DATABASE
//////

sequelize.authenticate().then(async () => {
  log(chalk.green(`connection ok`))
  try {
    await sequelize.sync({ force: config.db.forceSync })
    log(chalk.green(`sync is done`))
  } catch (err) {
    console.log(chalk.red(`sync FAIL`))
    console.log(err)
  }
})

module.exports = {
  sequelize,
  School,
  User,
  Teacher,
  Place,
  Lesson,
  Rate,
  Registration,
}
