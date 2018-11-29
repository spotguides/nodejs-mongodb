'use strict'

const User = require('../../../models/User')

async function getAllHandler(ctx) {
  ctx.body = await User.getAll()
}

module.exports = getAllHandler
