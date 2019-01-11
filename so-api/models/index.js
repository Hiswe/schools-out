'use strict'

const { debuglog } = require('util')
const chalk = require('chalk')

const config = require('../config')
const { sequelize } = require('../services')

const log = debuglog(`api:db`)

// MODELS

const School = require('./schools')
const Student = require('./students')
const Teacher = require('./teachers')
const Place = require('./places')
const Lesson = require('./lessons')
const Registration = require('./registrations')
const Rate = require('./rates')
const Tag = require('./tags')

//////
// RELATIONS
//////

School.hasMany(Student)
School.hasMany(Teacher)
School.hasMany(Place)
School.hasMany(Lesson)
School.hasMany(Rate)
School.hasMany(Tag)

// TODO: a user can belong to many schools
Student.belongsTo(School)
Student.hasMany(Registration)

Place.hasMany(Lesson)
// TODO: a room can belong to many schools
Place.belongsTo(School)

Teacher.belongsTo(School)
Teacher.hasMany(Lesson)

Lesson.belongsTo(School)
Lesson.belongsTo(Teacher)
Lesson.belongsTo(Place)
Lesson.belongsToMany(Registration, { through: `RegistrationLesson` })

Rate.belongsTo(School)
Rate.belongsTo(Tag)

Tag.belongsTo(School)

Registration.belongsTo(School)
Registration.belongsTo(Student)
Registration.belongsTo(Rate)
Registration.belongsToMany(Lesson, { through: `RegistrationLesson` })

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
  Student,
  Lesson,
  Place,
  Rate,
  Registration,
  School,
  Tag,
  Teacher,
}
