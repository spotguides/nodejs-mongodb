'use strict'

const http = require('http')
const Koa = require('koa')
const { makeRequest } = require('@banzaicloud/service-tools/dist/helper')
const db = require('../../../database')
const readiness = require('./readiness')

jest.mock('../../../database', () => ({
  healthCheck: jest.fn(),
}))

describe('Route handlers', () => {
  let server

  beforeEach(() => {
    const app = new Koa()
    app.use(readiness)
    server = http.createServer(app.callback())
  })

  describe('Readiness probe', () => {
    it('should respond with 200 when the database is alive', async () => {
      db.healthCheck.mockImplementationOnce(() => Promise.resolve())
      const response = await makeRequest(server)
      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual({ status: 'ok' })
      expect(db.healthCheck).toHaveBeenCalled()
    })

    it('should respond with 500 when the database is unreachable', async () => {
      db.healthCheck.mockImplementationOnce(() => Promise.reject())
      const response = await makeRequest(server)
      expect(response.statusCode).toEqual(500)
      expect(response.body).toEqual({ status: 'error' })
      expect(db.healthCheck).toHaveBeenCalled()
    })

    it('should respond with 503 when application is shutting down', async () => {
      process.emit('SIGTERM')
      const response = await makeRequest(server)
      expect(response.statusCode).toEqual(503)
      expect(response.body).toEqual({ status: 'error', details: { reason: 'service is shutting down' } })
    })
  })
})
