'use strict'

const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const { ObjectId } = require('bson')
const { makeRequest } = require('@banzaicloud/service-tools/dist/helper')
const User = require('../../../models/User')
const { delete: handler } = require('./')

jest.mock('../../../models/User', () => ({
  delete: jest.fn(),
}))

describe('Route handlers', () => {
  let server
  let id

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  beforeEach(() => {
    const app = new Koa()
    const router = new Router()
    app.use(bodyParser())
    router.delete('/:id', handler)
    app.use(router.routes())
    server = http.createServer(app.callback())
    id = new ObjectId().toHexString()
  })

  describe('Delete user', () => {
    it('should respond with 204 when the user is deleted', async () => {
      User.delete.mockImplementationOnce(() => Promise.resolve())
      const response = await makeRequest(server, { method: 'DELETE', endpoint: `/${id}` })
      expect(response.statusCode).toEqual(204)
      expect(User.delete).toHaveBeenCalledWith(id)
    })

    it('should respond with 500 when the database call fails', async () => {
      User.delete.mockImplementationOnce(() => Promise.reject(new Error()))
      const response = await makeRequest(server, { method: 'DELETE', endpoint: `/${id}` })
      expect(response.statusCode).toEqual(500)
    })
  })
})
