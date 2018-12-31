'use strict'

const Sequelize = require('sequelize')

const { sequelize } = require('../services')

const Lesson = sequelize.define(`lesson`, {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  startHour: {
    type: Sequelize.FLOAT,
  },
  duration: {
    type: Sequelize.FLOAT,
  },
  // day of the week
  day: {
    type: Sequelize.INTEGER,
  },
  // début/fin des cours
  startAt: {
    type: Sequelize.DATEONLY,
  },
  endAt: {
    type: Sequelize.DATEONLY,
  },
  // can put “required skill” here (beginner…)
  info: {
    type: Sequelize.JSON,
    defaultValue: {},
  },
})

module.exports = Lesson
