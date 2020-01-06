const joi = require('@hapi/joi')

const envVarsSchema = joi
  .object({
    MONGODB_URI: joi
      .string()
      .uri({ scheme: 'mongodb' })
      .default(
        // prettier-ignore
        ({
          MONGODB_USERNAME = '', MONGODB_PASSWORD = '', MONGODB_HOST = '127.0.0.1', MONGODB_PORT = 27017, MONGODB_DATABASE = '', MONGODB_AUTH_SOURCE = ''
        }) => `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}${MONGODB_AUTH_SOURCE ? `?authSource=${MONGODB_AUTH_SOURCE}` : ''}`
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
    MONGODB_AUTH_SOURCE: joi.string().allow(''),
  })
  .unknown()
  .required()

const { value: envVars, error } = envVarsSchema.validate(process.env, {
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
