'use strict'

const Sequelize = require('sequelize')
// const bcrypt = require('bcryptjs')
// const randtoken = require('rand-token')
// const merge = require('lodash.merge')
// const moment = require('moment')
// const urlJoin = require('url-join')

const { sequelize } = require('../services')
const USER_TYPES = require('./users-types')
// const config = require('../config')
// const mailing = require('../mailing')
// const dbGetterSetter = require('../utils/db-getter-setter')

// function encodePassword(password) {
//   if (typeof password === `undefined`) return null
//   return bcrypt.hashSync(password, 10)
// }

// TODO:
// sur le EXCEL le tarif est porté par l'utilisateur
//  • simple
//  • couple
//  • enfant
//  • séance
//  • équipe

// paiement à l'heure

//////
// MODEL DEFINITION
//////

const Student = sequelize.define(
  `student`,
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      // TODO: email should be unique by school
      // unique: true,
      validate: { isEmail: true },
      // set: dbGetterSetter.setNormalizedString(`email`),
    },
    type: {
      type: Sequelize.ENUM(...USER_TYPES.list),
      allowNull: false,
      validate: {
        isIn: [USER_TYPES.list],
      },
      default: USER_TYPES[0],
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
      // set: dbGetterSetter.setTrimmedString(`name`),
    },
    birthday: {
      type: Sequelize.DATEONLY,
    },
    lang: {
      type: Sequelize.CHAR(2),
      defaultValue: `fr`,
      validate: {
        isIn: [[`en`, `fr`]],
      },
    },
    info: {
      type: Sequelize.JSON,
      defaultValue: {},
    },
    // SESSION
    password: {
      type: Sequelize.STRING,
      // set: function(val) {
      //   this.setDataValue(`password`, encodePassword(val))
      //   this.setDataValue(`token`, null)
      //   this.setDataValue(`tokenExpire`, null)
      // },
    },
    token: {
      type: Sequelize.STRING,
    },
    tokenExpire: {
      type: Sequelize.DATE,
    },
  },
  {
    paranoid: true,
  },
)

//////
// INSTANCE METHODS
//////

// Student.prototype.comparePassword = async function(password) {
//   const studentPassword = this.getDataValue(`password`)
//   if (!studentPassword) return Promise.resolve(false)
//   const result = await bcrypt.compare(password, studentPassword)
//   return result
// }

// Student.prototype.resetPassword = async function(redirectUrl) {
//   if (!redirectUrl) {
//     throw new Error(`[USER] account – redirectUrl param is required`)
//   }
//   const token = randtoken.generate(30)
//   redirectUrl = urlJoin(redirectUrl, `?token=${token}`)
//   this.setDataValue(`token`, token)
//   this.setDataValue(`tokenExpire`, moment().add(1, 'day'))
//   const student = await this.save()
//   const content = `click here to reset your password:

// ${redirectUrl}
// `
//   const mailOptions = {
//     to: student.email,
//     subject: `${config.NAME} – reset password`,
//     text: content,
//     html: content.replace('\n', `<br />`),
//   }
//   const mailStatus = await mailing.send(mailOptions)
//   return student
// }

// Student.prototype.resetPasswordTokenOnly = async function() {
//   const token = randtoken.generate(30)
//   this.setDataValue(`token`, token)
//   this.setDataValue(`tokenExpire`, moment().add(1, 'day'))
//   const student = await this.save()
//   const content = `this is your confirmation code

// ${token}
// `
//   const mailOptions = {
//     to: student.email,
//     subject: `${config.NAME} – reset password`,
//     text: content,
//     html: content.replace('\n', `<br />`),
//   }
//   const mailStatus = await mailing.send(mailOptions)
//   return student
// }

// Student.prototype.setPassword = async function(password) {
//   this.set(`password`, password)
//   const student = await this.save()
//   return student
// }

module.exports = Student
