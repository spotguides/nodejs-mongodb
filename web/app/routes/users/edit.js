'use strict'

const joi = require('joi')
const compose = require('koa-compose')
const { middleware } = require('@banzaicloud/service-tools')
const User = require('../../../models/User')

const schemaValidator = middleware.koa.requestValidator({
  params: joi
    .object({
      id: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    })
    .required(),
  body: joi
    .object({
      email: joi.string().email(),
      username: joi.string(),
      firstName: joi.string(),
      lastName: joi.string(),
    })
    .min(1)
    .required(),
})

async function editHandler(ctx) {
  const { body: user, params } = ctx.state.validated

  ctx.body = await User.edit(params.id, user)
  if (!ctx.body) {
    ctx.throw(404)
  }
}

module.exports = compose([schemaValidator, editHandler])
