'use strict'

// un utilisateur s'inscrit pour
// • 1 mois
// • 1 trimestre
// • 1 durée en fait (x mois)

const Sequelize = require('sequelize')

const { sequelize } = require('../services')

const Inscription = sequelize.define(`inscription`, {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  startAt: {
    type: Sequelize.DATEONLY,
  },
  duration: {
    type: Sequelize.FLOAT,
  },
  // price: {
  //   type: Sequelize.FLOAT,
  //   default: 0,
  // },
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

module.exports = Inscription
