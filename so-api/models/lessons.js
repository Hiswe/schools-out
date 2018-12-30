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
  startAt: {
    type: Sequelize.FLOAT,
  },
  duration: {
    type: Sequelize.FLOAT,
  },
})

module.exports = Lesson
