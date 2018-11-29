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
})

async function deleteHandler(ctx) {
  const { params } = ctx.state.validated
  await User.delete(params.id)
  ctx.status = 204
}

module.exports = compose([schemaValidator, deleteHandler])
