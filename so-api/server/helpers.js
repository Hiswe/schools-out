'use strict'

const { inspect } = require('util')

module.exports = { printInstance }

function printInstance(instance) {
  console.log(
    inspect(JSON.parse(JSON.stringify(instance)), { colors: true, depth: 4 }),
  )
}
