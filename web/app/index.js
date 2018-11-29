'use strict'

const { middleware } = require('@banzaicloud/service-tools')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Prometheus = require('../models/Prometheus')
const config = require('./config')
const routes = require('./routes')

const app = new Koa()

const defaultLabels = {
  name: config.pod.name,
  namespace: config.pod.namespace,
  image: config.pod.image,
}
Prometheus.register.setDefaultLabels(defaultLabels)

// register middleware
app.use(async (ctx, next) => {
  if (ctx.path === '/metrics') {
    await next()
    return
  }

  const start = Date.now()

  Prometheus.httpRequestInFlight.inc({
    method: ctx.method,
    path: ctx.path,
    status_code: ctx.status,
  })
  try {
    await next()
  } finally {
    Prometheus.httpRequestInFlight.dec({
      method: ctx.method,
      path: ctx.path,
      status_code: ctx.status,
    })

    const responseTimeInMs = Date.now() - start
    Prometheus.httpRequestDurationMicroseconds.observe(
      {
        method: ctx.method,
        path: ctx.path,
        status_code: ctx.status,
      },
      responseTimeInMs
    )
  }
})
app.use(middleware.koa.errorHandler())
app.use(middleware.koa.requestLogger())
app.use(bodyParser())
app.use(routes)

module.exports = app
