'use strict'

const joi = require('joi')
const compose = require('koa-compose')
const { middleware } = require('@banzaicloud/service-tools')

const schemaValidator = middleware.koa.requestValidator({
  query: joi
    .object({
      rate: joi
        .number()
        .min(0)
        .max(1)
        .default(0.5),
    })
    .required(),
})

async function getHandler(ctx) {
  const { query } = ctx.state.validated
  const { rate } = query
  if (rate >= Math.random()) {
    ctx.throw(new Error('Failed'))
    return
  }

  ctx.body = {
    success: 'OK',
  }
}

module.exports = compose([schemaValidator, getHandler])
