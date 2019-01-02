'use strict'

const rc = require('rc')

const pkg = require('./package.json')

const config = rc(`schoolsOutApi`, {
  NAME: `school's out API`,
  db: {
    forceSync: false,
    url: `postgres://localhost:5432/schools-out`,
  },
  redis: {
    url: `redis://localhost:6379`,
  },
  email: {
    transport: {
      host: `localhost`,
      port: 1025,
    },
    options: {
      from: `School's out <api@schools.out>`,
    },
  },
  delay: false,

  superAdmin: {
    id: `admin`,
    password: `admin`,
  },

  // delay: {
  //   base     : 1000,
  //   variation: 500,
  // },
  jwt: {
    // node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
    secret: `27618ee0bbfbf13ab04b310b88091c79810da099841675ccba82a84e9722872f`,
    expiresIn: `1 days`,
  },
  enforceHttps: false,
})

config.VERSION = pkg.version

config.PORT = config.PORT || process.env.PORT || 4060

config.NODE_ENV = config.NODE_ENV || process.env.NODE_ENV || `development`
config.isDev = config.NODE_ENV === `development`
config.isProd = config.NODE_ENV === `production`

// Don't want that to happen in production
if (config.isProd) {
  // This can ruin the database!
  config.db.forceSync = false
  // Want the prod version to be as fast as possible
  config.delay = false
}

module.exports = config
