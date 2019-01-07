'use strict'

const Sequelize = require('sequelize')

const { sequelize } = require('../services')

const School = sequelize.define(`school`, {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    // set: dbGetterSetter.setTrimmedString(`name`),
  },
  openAt: {
    type: Sequelize.DATEONLY,
  },
  closeAt: {
    type: Sequelize.DATEONLY,
  },
})

module.exports = School
