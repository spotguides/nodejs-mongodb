'use strict'

const fs = require('fs')
const path = require('path')
const semver = require('semver')
const { config, logger } = require('@banzaicloud/service-tools')

// when NODE_ENV is 'development', loads variables from .env as a side effect
const { nodeEnv } = config.environment

// intercept console calls and use built in (pino) logger instead
logger.interceptConsole()

// check runtime
let nodeVersionRequirement
try {
  const nvmrc = fs.readFileSync(path.join(__dirname, '.nvmrc'), { encoding: 'utf8' })
  nodeVersionRequirement = nvmrc.trim()
} catch (err) {
  // ignore
}

if (nodeVersionRequirement && !semver.satisfies(process.version, nodeVersionRequirement)) {
  throw new Error(
    `Node.js runtime version not satisfied (required: ${nodeVersionRequirement}, current: ${
      process.version
    }), run \`nvm install ${nodeVersionRequirement}\` or see https://nodejs.org/`
  )
}

console.log('starting application', { nodeEnv })
require('./web')
