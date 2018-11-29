'use strict'

const joi = require('joi')
const compose = require('koa-compose')
const { middleware } = require('@banzaicloud/service-tools')

const schemaValidator = middleware.koa.requestValidator({
  query: joi
    .object({
      delay: joi
        .number()
        .integer()
        .unit('ms')
        .default(() => Math.floor(Math.random() * 10000), 'Random delay between 0-10000'),
    })
    .required(),
})

async function getHandler(ctx) {
  const { query } = ctx.state.validated
  const { delay } = query

  await new Promise((resolve) => setTimeout(resolve, delay))

  ctx.body = {
    delay,
  }
}

module.exports = compose([schemaValidator, getHandler])
