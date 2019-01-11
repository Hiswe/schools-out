'use strict'

const {
  Lesson,
  Teacher,
  Place,
  Registration,
  Student,
  Rate,
} = require('../models')
const { printInstance } = require('./helpers')

module.exports = {
  list: listLessons,
  create: createLesson,
  read: readLesson,
  update: updateLesson,
}

const defaultRelations = Object.freeze([
  {
    model: Teacher,
    attributes: [`id`, `name`],
  },
  {
    model: Place,
    attributes: [`id`, `name`],
  },
  {
    model: Registration,
    include: [
      {
        model: Student,
        attributes: [`id`, `name`, `email`],
      },
      {
        model: Rate,
      },
    ],
  },
])

async function listLessons(ctx) {
  const params = {
    include: defaultRelations,
  }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const lessons = await Lesson.findAll(params)
  ctx.body = lessons
}

async function createLesson(ctx) {
  const { body } = ctx.request
  const { schoolId } = ctx.state.jwtData
  body.schoolId = body.schoolId || schoolId
  const newLesson = await Lesson.create(body)
  const lesson = await Lesson.findByPk(newLesson.id, {
    include: defaultRelations,
  })
  ctx.body = lesson
}

async function readLesson(ctx) {
  const { lessonId } = ctx.params
  const lesson = await Lesson.findByPk(lessonId, {
    include: defaultRelations,
  })
  ctx.body = lesson
}

async function updateLesson(ctx) {
  const { lessonId } = ctx.params
  const lesson = await Lesson.findByPk(lessonId)
  ctx.assert(lesson, 404, `lesson not found`)

  const { body } = ctx.request
  await lesson.update(body)

  const updatedLesson = await Lesson.findByPk(lesson.id, {
    include: defaultRelations,
  })
  ctx.body = updatedLesson
}
