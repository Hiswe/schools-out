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
    weeklyHours: {
      type: Sequelize.FLOAT,
    },
    info: {
      type: Sequelize.JSON,
      defaultValue: {},
    },
    nameWeekly: {
      type: new Sequelize.VIRTUAL(Sequelize.STRING, [`name`, `weeklyHours`]),
      get() {
        const name = this.getDataValue(`name`)
        const weeklyHours = this.getDataValue(`weeklyHours`)
        return `${name} - ${weeklyHours}/w`
      },
    },
    nameFull: {
      type: new Sequelize.VIRTUAL(Sequelize.STRING, [
        `name`,
        `weeklyHours`,
        `price`,
      ]),
      get() {
        const name = this.getDataValue(`name`)
        const weeklyHours = this.getDataValue(`weeklyHours`)
        const price = this.getDataValue(`price`)
        return `${name} - ${weeklyHours}h/w - ${price}€`
      },
    },
  },
  {
    timestamps: false,
  },
)

module.exports = Rate
