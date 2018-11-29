'use strict'

const joi = require('joi')

const envVarsSchema = joi
  .object({
    MONGODB_URI: joi
      .string()
      .uri({ scheme: 'mongodb' })
      .default(
        // prettier-ignore
        ({
          MONGODB_USERNAME = '', MONGODB_PASSWORD = '', MONGODB_HOST = '127.0.0.1', MONGODB_PORT = 27017, MONGODB_DATABASE = '',
        }) => `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`,
        'construct URI from other environment variables'
      ),
    MONGODB_HOST: joi
      .string()
      .hostname()
      .default('127.0.0.1'),
    MONGODB_PORT: joi
      .number()
      .integer()
      .default(27017),
    MONGODB_USERNAME: joi.string().allow(''),
    MONGODB_PASSWORD: joi.string().allow(''),
    MONGODB_DATABASE: joi.string().allow(''),
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
  uri: envVars.MONGODB_URI,
}

module.exports = config
