'use strict'

const { Student, Registration, Lesson, Teacher, Rate } = require('../models')
const { printInstance } = require('./helpers')

module.exports = {
  list: listStudents,
  create: createStudent,
  read: readStudent,
  update: updateStudent,
}

const defaultRelations = Object.freeze([
  {
    model: Registration,
    include: [
      {
        model: Lesson,
        include: [
          {
            model: Teacher,
          },
        ],
      },
      {
        model: Rate,
      },
    ],
  },
])
const defaultAttributes = Object.freeze({
  exclude: [`password`, `token`, `tokenExpire`, `deletedAt`],
})

async function listStudents(ctx) {
  const params = {
    include: defaultRelations,
    attributes: defaultAttributes,
  }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const students = await Student.findAll(params)
  ctx.body = students
}

async function createStudent(ctx) {
  const { body } = ctx.request
  const { schoolId } = ctx.state.jwtData
  body.schoolId = body.schoolId || schoolId
  const newStudent = await Student.create(body)
  const student = await Student.findByPk(newStudent.id, {
    include: defaultRelations,
    attributes: defaultAttributes,
  })
  ctx.body = student
}

async function readStudent(ctx) {
  const { studentId } = ctx.params
  const student = await Student.findByPk(studentId, {
    include: defaultRelations,
    attributes: defaultAttributes,
  })
  ctx.body = student
}

async function updateStudent(ctx) {
  const { studentId } = ctx.params
  const student = await Student.findByPk(studentId)
  ctx.assert(student, 404, `student not found`)

  const { body } = ctx.request
  await student.update(body)

  const updatedStudent = await Student.findByPk(student.id, {
    include: defaultRelations,
    attributes: defaultAttributes,
  })
  ctx.body = updatedStudent
}
