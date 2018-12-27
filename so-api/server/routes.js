'use strict'

const Router = require('koa-router')

const { School } = require('../models')

const apiRouter = new Router({
  prefix: `/v1`,
})

apiRouter
  .get(`/`, async ctx => {
    ctx.body = {
      version: `v1`,
    }
  })
  .get(`/schools`, async ctx => {
    const schools = await School.findAll({})
    ctx.body = schools
  })
  .post(`/schools`, async ctx => {
    const { body } = ctx.request
    // const school = await
    const schools = await School.findAll({})
    ctx.body = schools
  })

module.exports = apiRouter
