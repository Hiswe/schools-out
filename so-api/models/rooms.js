'use strict'

const Sequelize = require('sequelize')

const { sequelize } = require('../services')

const Room = sequelize.define(`room`, {
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
})

module.exports = Room
