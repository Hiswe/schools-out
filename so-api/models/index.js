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
const Inscription = require('./inscriptions')

//////
// RELATIONS
//////

School.hasMany(User)
School.hasMany(Teacher)
School.hasMany(Room)
School.hasMany(Lesson)

// TODO: a user can belong to many schools
User.belongsTo(School)
User.hasMany(Inscription)

Room.hasMany(Lesson)
// TODO: a room can belong to many schools
Room.belongsTo(School)

Teacher.belongsTo(School)
Teacher.hasMany(Lesson)

Lesson.belongsTo(School)
Lesson.belongsTo(Teacher)
Lesson.belongsTo(Room)
Lesson.belongsToMany(Inscription, { through: `lessonInscription` })

Inscription.belongsTo(User)
Inscription.belongsTo(Lesson)
// TODO: prices
// Inscription.hasOne(Price)

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
