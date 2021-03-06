const http = require('http')
const { promisify } = require('util')
const { catchErrors, gracefulShutdown, logger } = require('@banzaicloud/service-tools')
const stoppable = require('stoppable')
const tracing = require('@opencensus/nodejs')
const { JaegerTraceExporter } = require('@opencensus/exporter-jaeger')
const config = require('./config')

// Start tracer
if (!config.tracing.disabled) {
  const exporter = new JaegerTraceExporter(config.jaeger)

  tracing.registerExporter(exporter).start({ logger, samplingRate: config.tracing.samplingRate })
}

const app = require('./app')
const db = require('./database')

// use `stoppable` to stop accepting new connections and closes existing,
// idle connections(including keep - alives) without killing requests that are in-flight
// on .stop() call
const server = stoppable(http.createServer(app.callback()))
server.shutdown = promisify(server.stop).bind(server)

server.once('listening', () => {
  const { port } = server.address()
  console.log(`server is listening on port ${port}`)
})

server.once('error', (err) => {
  console.error('server error', err)
  process.exit(1)
})

server.listen(config.port)

// catch all uncaught exceptions and unhandled promise rejections and exit application
catchErrors([server.shutdown, db.shutdown])

// gracefully handle application stop
gracefulShutdown([db.shutdown])
