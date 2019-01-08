'use strict'

const Sequelize = require('sequelize')

const { sequelize } = require('../services')

const Place = sequelize.define(
  `place`,
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    capacity: {
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

module.exports = Place
