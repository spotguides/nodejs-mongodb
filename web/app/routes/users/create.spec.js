'use strict'

const http = require('http')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { ObjectId } = require('bson')
const { makeRequest } = require('@banzaicloud/service-tools/dist/helper')
const User = require('../../../models/User')
const { create: handler } = require('./')

jest.mock('../../../models/User', () => ({
  create: jest.fn(),
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
    app.use(bodyParser())
    app.use(handler)
    server = http.createServer(app.callback())
    id = new ObjectId().toHexString()
    user = { email: 'user@email.com', username: 'user', firstName: 'First', lastName: 'Last' }
  })

  describe('Create user', () => {
    it('should respond with 201 when the user is created', async () => {
      User.create.mockImplementationOnce(() => Promise.resolve(Object.assign({ id }, user)))
      const response = await makeRequest(server, { method: 'POST', body: user })
      expect(response.statusCode).toEqual(201)
      expect(response.body).toEqual(Object.assign({ id }, user))
      expect(User.create).toHaveBeenCalledWith(user)
    })

    it('should respond with 400 when the request body is invalid', async () => {
      User.create.mockImplementationOnce(() => Promise.resolve())
      delete user.email
      const response = await makeRequest(server, { method: 'POST', body: user })
      expect(response.statusCode).toEqual(400)
      expect(User.create).not.toHaveBeenCalled()
    })

    it('should respond with 409 when the user already exists', async () => {
      User.create.mockImplementationOnce(() => Promise.reject(Object.assign(new Error(), { code: 11000 })))
      const response = await makeRequest(server, { method: 'POST', body: user })
      expect(response.statusCode).toEqual(409)
      expect(response.body).toEqual('A user already exists with this email address')
      expect(User.create).toHaveBeenCalledWith(user)
    })

    it('should respond with 500 when the database call fails', async () => {
      User.create.mockImplementationOnce(() => Promise.reject(new Error()))
      const response = await makeRequest(server, { method: 'POST', body: user })
      expect(response.statusCode).toEqual(500)
      expect(User.create).toHaveBeenCalledWith(user)
    })
  })
})
