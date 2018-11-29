'use strict'

const Router = require('koa-router')
const compose = require('koa-compose')
const { middleware } = require('@banzaicloud/service-tools')
const Prometheus = require('../../models/Prometheus')
const root = require('./root')
const health = require('./health')
const users = require('./users')
const fail = require('./fail')
const slow = require('./slow')

const router = new Router()
const apiRouter = new Router({
  prefix: '/api/v1',
})

router.get('/', root.get)
router.get('/metrics', middleware.koa.prometheusMetrics({ client: Prometheus }))
router.get('/healthy', health.liveness)
router.get('/ready', health.readiness)
// for metrics demonstration only
router.get('/debug/fail', fail.get)
router.get('/debug/slow', slow.get)

apiRouter.get('/', async (ctx) => {
  ctx.body = apiRouter.stack.map(({ path, methods }) => ({ path, methods }))
})
apiRouter.post('/users', users.create)
apiRouter.get('/users', users.getAll)
apiRouter.get('/users/:id', users.getById)
apiRouter.put('/users/:id', users.edit)
apiRouter.delete('/users/:id', users.delete)

module.exports = compose([router.routes(), apiRouter.routes(), router.allowedMethods(), apiRouter.allowedMethods()])
