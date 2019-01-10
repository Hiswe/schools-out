import flow from 'lodash.flow';
import { Duration } from 'luxon';
import slugify from '@sindresorhus/slugify';

const getNestedValue = (obj, keys) => keys.reduce((o, k) => o[k], obj);

const formatHour = hours => {
  return Duration.fromObject({ hours })
    .toFormat(`h:mm`)
    .replace(`:`, `h`)
};

const splitBy = keys => (aggregator, val) => {
  const keyName = getNestedValue(val, keys);
  aggregator[keyName] = aggregator[keyName] || [];
  aggregator[keyName].push(val);
  return aggregator
};

const splitByName = splitBy([`name`]);

const sortByName = ([a], [b]) => (a !== b ? (a < b ? -1 : 1) : 0);

const cleanRate = rate => ({
  id: rate.id,
  name: rate.name,
  price: rate.price,
  hours: rate.weeklyHours,
  category: rate[`tag.name`] || rate.tag.name,
});

const makeCategoryOrderedByAveragePrice = flow([
  rates => rates.map(r => ({ name: r.category, price: r.price })),
  rates => rates.reduce(splitByName, {}),
  Object.entries,
  ratesGrouped =>
    ratesGrouped.map(([groupName, rates]) => ({
      name: groupName,
      average: rates.reduce((t, r) => t + r.price, 0) / rates.length,
    })),
  ratesGrouped => ratesGrouped.sort((a, b) => a.average > b.average),
  ratesGrouped => ratesGrouped.map(rg => rg.name),
]);

const createGrid = ([groupName, rates]) => {
  const durations = [...new Set(rates.map(r => r.hours))].sort();
  const categories = makeCategoryOrderedByAveragePrice(rates);
  rates = rates.reduce((acc, rate) => {
    acc[`${rate.hours}-${rate.category}`] = { id: rate.id, price: rate.price };
    return acc
  }, {});
  const priceGrid = durations.map(duration => {
    const formatedDuration = formatHour(duration);
    return [
      {
        id: `duration-${slugify(groupName)}-${formatedDuration}`,
        duration: formatedDuration,
      },
      ...categories.map(category => {
        return rates[`${duration}-${category}`] || {}
      }),
    ]
  });
  return {
    name: groupName,
    header: [`hours`, ...categories],
    body: priceGrid,
  }
};

const ratesTableToGrid = flow([
  rates => rates.map(cleanRate),
  rates => rates.reduce(splitByName, {}),
  Object.entries,
  groupedRates => groupedRates.sort(sortByName),
  groupedRates => groupedRates.map(createGrid),
]);

export { formatHour, ratesTableToGrid };
