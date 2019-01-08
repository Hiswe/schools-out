'use strict'

const Sequelize = require('sequelize')
const dayjs = require('dayjs')

const { sequelize } = require('../services')

function getHour(stringTime) {
  const [h, m] = stringTime.split(`:`).map(v => ~~v)
  return dayjs()
    .set(`h`, h)
    .set(`m`, m)
}

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
      allowNull: false,
    },
    startHour: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    endHour: {
      type: Sequelize.VIRTUAL(Sequelize.STRING),
      get() {
        const start = this.getDataValue(`startHour`)
        const startTime = getHour(start)
        const duration = this.getDataValue(`duration`)
        return startTime
          .clone()
          .add(duration, `h`)
          .format(`HH:mm`)
      },
    },
    duration: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    // day of the week
    day: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    dayName: {
      type: Sequelize.VIRTUAL(Sequelize.STRING),
      get() {
        const day = this.getDataValue(`day`)
        return days[day] || `–`
      },
    },
    schedule: {
      type: Sequelize.VIRTUAL(Sequelize.STRING),
      get() {
        const start = this.getDataValue(`startHour`)
        const startTime = getHour(start)
        const duration = this.getDataValue(`duration`)
        const endTime = startTime.clone().add(duration, `h`)
        return `${startTime.format(`HH:mm`)}–${endTime.format(`HH:mm`)}`
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
