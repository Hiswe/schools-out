'use strict'

// un utilisateur s'inscrit pour
// • 1 mois
// • 1 trimestre
// • 1 durée en fait (x mois)

const Sequelize = require('sequelize')

const { sequelize } = require('../services')

const Registration = sequelize.define(`registration`, {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  startAt: {
    type: Sequelize.DATEONLY,
  },
  endAt: {
    type: Sequelize.DATEONLY,
  },
  priceAtRegistration: {
    type: Sequelize.FLOAT,
  },
  paid: {
    type: Sequelize.FLOAT,
    default: 0,
  },
  discount: {
    type: Sequelize.FLOAT,
    default: 0,
  },
  payments: {
    type: Sequelize.JSON,
    defaultValue: {},
  },
})

module.exports = Registration
