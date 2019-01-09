'use strict'

module.exports = {
  ratesTableToGrid,
}

const getNestedValue = (obj, keys) => keys.reduce((o, k) => o[k], obj)

const splitBy = keys => (aggregator, val) => {
  const keyName = getNestedValue(val, keys)
  aggregator[keyName] = aggregator[keyName] || []
  aggregator[keyName].push(val)
  return aggregator
}

const splitByName = splitBy([`name`])
const splitByTag = splitBy([`tag`, `name`])

function flattenObjectToArray(obj) {
  return Object.entries(obj)
    .sort(([a], [b]) => (a !== b ? (a < b ? -1 : 1) : 0))
    .map(([key, value]) => value)
}

function ratesTableToGrid(rates) {
  return flattenObjectToArray(
    rates
      .map(r => {
        r.tagName = r[`tag.name`]
        delete r[`tag.name`]
        return r
      })
      .reduce(splitByName, {}),
  ).map(names => {
    const orderedByTag = Object.entries(names.reduce(splitByTag, {}))
      .map(([tagName, rates]) => {
        const total = rates.reduce((total, rate) => total + rate.price, 0)
        const average = total / rates.length
        return {
          tagName,
          rates: rates.sort((a, b) => a.price > b.price),
          total,
          average,
        }
      })
      .sort((a, b) => a.average > b.average)
    return orderedByTag
  })
}
