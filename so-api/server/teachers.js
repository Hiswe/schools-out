'use strict'

const { Teacher } = require('../models')

module.exports = {
  list: listTeachers,
  create: createTeacher,
  read: readTeacher,
  update: updateTeacher,
}

const defaultRelations = Object.freeze([])

async function listTeachers(ctx) {
  const params = {
    include: defaultRelations,
  }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const teachers = await Teacher.findAll(params)
  ctx.body = teachers
}

async function createTeacher(ctx) {
  const { body } = ctx.request
  const { schoolId } = ctx.state.jwtData
  body.schoolId = body.schoolId || schoolId
  const newTeacher = await Teacher.create(body)
  const teacher = await Teacher.findByPk(newTeacher.id, {
    include: defaultRelations,
  })
  ctx.body = teacher
}

async function readTeacher(ctx) {
  const { teacherId } = ctx.params
  const teacher = await Teacher.findByPk(teacherId, {
    include: defaultRelations,
  })
  ctx.body = teacher
}

async function updateTeacher(ctx) {
  const { teacherId } = ctx.params
  const teacher = await Teacher.findByPk(teacherId)
  ctx.assert(teacher, 404, `teacher not found`)

  const { body } = ctx.request
  await teacher.update(body)

  const updatedTeacher = await Teacher.findByPk(teacher.id, {
    include: defaultRelations,
  })
  ctx.body = updatedTeacher
}
