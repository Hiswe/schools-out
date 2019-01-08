'use strict'

const Sequelize = require('sequelize')

const { sequelize } = require('../services')

const Tag = sequelize.define(
  `tag`,
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      // set: dbGetterSetter.setTrimmedString(`name`),
    },
  },
  {
    timestamps: false,
  },
)

module.exports = Tag
