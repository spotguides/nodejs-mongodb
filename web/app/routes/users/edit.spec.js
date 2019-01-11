'use strict'

const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const { ObjectId } = require('bson')
const { makeRequest } = require('@banzaicloud/service-tools/dist/helper')
const User = require('../../../models/User')
const { edit: handler } = require('./')

jest.mock('../../../models/User', () => ({
  edit: jest.fn(),
}))

describe('Route handlers', () => {
  let server
  let user
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
    router.put('/:id', handler)
    app.use(bodyParser())
    app.use(router.routes())
    app.use(router.allowedMethods())
    server = http.createServer(app.callback())
    id = new ObjectId().toHexString()
    user = { email: 'user@email.com', username: 'user', firstName: 'First', lastName: 'Last' }
  })

  describe('Edit user', () => {
    it('should respond with 200 when the user is edited', async () => {
      User.edit.mockImplementationOnce(() => Promise.resolve(Object.assign({ id }, user)))
      const response = await makeRequest(server, { method: 'PUT', endpoint: `/${id}`, body: user })
      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual(Object.assign({ id }, user))
      expect(User.edit).toHaveBeenCalledWith(id, user)
    })

    it('should respond with 400 when the request body is invalid', async () => {
      User.edit.mockImplementationOnce(() => Promise.resolve())
      const response = await makeRequest(server, { method: 'PUT', endpoint: `/${id}`, body: {} })
      expect(response.statusCode).toEqual(400)
      expect(User.edit).not.toHaveBeenCalled()
    })

    it('should respond with 404 when the user does not exist', async () => {
      User.edit.mockImplementationOnce(() => Promise.resolve())
      const response = await makeRequest(server, { method: 'PUT', endpoint: `/${id}`, body: user })
      expect(response.statusCode).toEqual(404)
      expect(User.edit).toHaveBeenCalledWith(id, user)
    })

    it('should respond with 500 when the database call fails', async () => {
      User.edit.mockImplementationOnce(() => Promise.reject(new Error()))
      const response = await makeRequest(server, { method: 'PUT', endpoint: `/${id}`, body: user })
      expect(response.statusCode).toEqual(500)
    })
  })
})
