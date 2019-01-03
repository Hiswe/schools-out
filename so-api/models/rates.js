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
    // duration: {
    //   type: Sequelize.FLOAT,
    // },
    weeklyLessons: {
      type: Sequelize.INTEGER,
    },
    info: {
      type: Sequelize.JSON,
      defaultValue: {},
    },
  },
  {
    timestamps: false,
  },
)

module.exports = Rate
