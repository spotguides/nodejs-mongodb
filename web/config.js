const joi = require('@hapi/joi')

const envVarsSchema = joi
  .object({
    PORT: joi
      .number()
      .integer()
      .min(0)
      .max(65535)
      .default(3000),
    JAEGER_SERVICE_NAME: joi.string().default('application'),
    JAEGER_AGENT_HOST: joi
      .string()
      .hostname()
      .default('127.0.0.1'),
    JAEGER_AGENT_PORT: joi
      .number()
      .integer()
      .min(0)
      .max(65535)
      .default(6832),
    TRACING_SAMPLING_RATE: joi
      .number()
      .min(0)
      .max(1)
      .default(1),
    TRACING_DISABLED: joi
      .boolean()
      .truthy('true')
      .truthy('TRUE')
      .falsy('false')
      .falsy('FALSE')
      .default(false),
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
  port: envVars.PORT,
  jaeger: {
    serviceName: envVars.JAEGER_SERVICE_NAME,
    host: envVars.JAEGER_AGENT_HOST,
    port: envVars.JAEGER_AGENT_PORT,
  },
  tracing: {
    samplingRate: envVars.TRACING_SAMPLING_RATE,
    disabled: envVars.TRACING_DISABLED,
  },
}

module.exports = config
