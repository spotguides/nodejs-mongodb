'use strict'

const config = require('../../config')

async function get(ctx) {
  const { pod } = config
  ctx.body = pod
}

module.exports = get
