'use strict'

const Prometheus = require('prom-client')

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in milliseconds',
  labelNames: ['method', 'path', 'status_code', 'name', 'namespace', 'image'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
})

const httpRequestInFlight = new Prometheus.Gauge({
  name: 'http_request_in_flight',
  help: 'Total number of in flight HTTP requests',
  labelNames: ['method', 'path', 'status_code', 'name', 'namespace', 'image'],
})

module.exports = Object.assign(Prometheus, {
  httpRequestDurationMicroseconds,
  httpRequestInFlight,
})
