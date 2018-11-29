'use strict'

const joi = require('joi')

const envVarsSchema = joi
  .object({
    POD_NAMESPACE: joi.string().default('not available'),
    POD_NAME: joi.string().default('not available'),
    POD_IMAGE: joi.string().default('not available'),
  })
  .unknown()
  .required()

const { value: envVars, error } = joi.validate(process.env, envVarsSchema, {
  abortEarly: false,
})
if (error) {
  // don't expose environment variables
  delete error._object
  throw error
}

const config = {
  pod: {
    namespace: envVars.POD_NAMESPACE,
    name: envVars.POD_NAME,
    image: envVars.POD_IMAGE,
  },
}

module.exports = config
