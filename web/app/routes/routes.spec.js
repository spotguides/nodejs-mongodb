'use strict'

const http = require('http')
const Koa = require('koa')
const { makeRequest } = require('@banzaicloud/service-tools/dist/helper')
const routes = require('./')
const root = require('./root')
const health = require('./health')
const users = require('./users')

jest.mock('./root', () => ({ get: jest.fn() }))
jest.mock('./health', () => ({ liveness: jest.fn(), readiness: jest.fn() }))
jest.mock('./users', () => ({
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  edit: jest.fn(),
  delete: jest.fn(),
}))

describe('Routes', () => {
  let server
  beforeEach(() => {
    const app = new Koa()
    app.use(routes)
    server = http.createServer(app.callback())
  })

  const routesToTest = [
    { method: 'GET', endpoint: '/', handler: root.get },
    { method: 'GET', endpoint: '/healthy', handler: health.liveness },
    { method: 'GET', endpoint: '/ready', handler: health.readiness },
    { method: 'POST', endpoint: '/api/v1/users', handler: users.create },
    { method: 'GET', endpoint: '/api/v1/users', handler: users.getAll },
    { method: 'GET', endpoint: '/api/v1/users/:id', handler: users.getById },
    { method: 'PUT', endpoint: '/api/v1/users/:id', handler: users.edit },
    { method: 'DELETE', endpoint: '/api/v1/users/:id', handler: users.delete },
  ]

  routesToTest.forEach(({ method, endpoint, handler }) => {
    describe(`${method} ${endpoint}`, () => {
      it('should call the handler', async () => {
        await makeRequest(server, { method, endpoint })
        expect(handler).toHaveBeenCalled()
      })
    })
  })
})
