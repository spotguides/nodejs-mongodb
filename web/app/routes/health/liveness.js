'use strict'

const { middleware } = require('@banzaicloud/service-tools')
const db = require('../../../database')

module.exports = middleware.koa.healthCheck([db.healthCheck], { serviceUnavailableOnTermination: false })
