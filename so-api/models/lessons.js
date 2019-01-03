'use strict'

const Sequelize = require('sequelize')

const { sequelize } = require('../services')

const days = Object.freeze([
  `sunday`,
  `monday`,
  `tuesday`,
  `wednesday`,
  `thursday`,
  `friday`,
  `saturday`,
])

const Lesson = sequelize.define(
  `lesson`,
  {
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
    dayName: {
      type: Sequelize.VIRTUAL(Sequelize.STRING),
      get() {
        const day = this.getDataValue(`day`)
        return days[day] || `–`
      },
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
  },
  {
    timestamps: false,
  },
)

module.exports = Lesson
