'use strict'

const mongoose = require('mongoose')
const config = require('./config')

mongoose
  .connect(
    config.uri,
    {
      promiseLibrary: global.Promise,
      bufferCommands: false,
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((err) => {
    console.error('failed to connect to MongoDB', err)
    process.exit(1)
  })

module.exports = Object.assign(mongoose, {
  async healthCheck() {
    if (
      mongoose.connection.readyState !== mongoose.STATES.connected &&
      mongoose.connection.readyState !== mongoose.STATES.connecting
    ) {
      throw new Error(`Database is not ready (state: ${mongoose.connection.readyState}`)
    }
  },
  async shutdown() {
    return mongoose.disconnect()
  },
})
