'use strict'

const Sequelize = require('sequelize')

const { sequelize } = require('../services')

const Rate = sequelize.define(
  `rate`,
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.FLOAT,
    },
    weeklyLessons: {
      type: Sequelize.INTEGER,
    },
    info: {
      type: Sequelize.JSON,
      defaultValue: {},
    },
    nameWeekly: {
      type: new Sequelize.VIRTUAL(Sequelize.STRING, [`name`, `weeklyLessons`]),
      get() {
        const name = this.getDataValue(`name`)
        const weeklyLessons = this.getDataValue(`weeklyLessons`)
        return `${name} - ${weeklyLessons}/w`
      },
    },
    nameFull: {
      type: new Sequelize.VIRTUAL(Sequelize.STRING, [
        `name`,
        `weeklyLessons`,
        `price`,
      ]),
      get() {
        const name = this.getDataValue(`name`)
        const weeklyLessons = this.getDataValue(`weeklyLessons`)
        const price = this.getDataValue(`price`)
        return `${name} - ${weeklyLessons}/w - ${price}€`
      },
    },
  },
  {
    timestamps: false,
  },
)

module.exports = Rate
