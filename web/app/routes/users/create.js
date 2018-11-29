'use strict'

const joi = require('joi')
const compose = require('koa-compose')
const { middleware } = require('@banzaicloud/service-tools')
const User = require('../../../models/User')

const schemaValidator = middleware.koa.requestValidator({
  body: joi
    .object({
      email: joi
        .string()
        .email()
        .required(),
      username: joi.string().required(),
      firstName: joi.string().required(),
      lastName: joi.string().required(),
    })
    .required(),
})

async function createHandler(ctx) {
  const { body: user } = ctx.state.validated

  try {
    ctx.body = await User.create(user)
    ctx.status = 201
  } catch (err) {
    if (err.code === 11000) {
      ctx.throw(409, new Error('A user already exists with this email address'))
      return
    }

    ctx.throw(err)
  }
}

module.exports = compose([schemaValidator, createHandler])
