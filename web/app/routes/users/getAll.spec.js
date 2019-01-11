'use strict'

const http = require('http')
const Koa = require('koa')
const { makeRequest } = require('@banzaicloud/service-tools/dist/helper')
const User = require('../../../models/User')
const { getAll: handler } = require('./')

jest.mock('../../../models/User', () => ({
  getAll: jest.fn(),
}))

describe('Route handlers', () => {
  let server

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  beforeEach(() => {
    const app = new Koa()
    app.use(handler)
    server = http.createServer(app.callback())
  })

  describe('Get all users', () => {
    it('should respond with 200 and the users', async () => {
      const users = [{ id: 1, email: 'user@email.com', username: 'user', firstName: 'First', lastName: 'Last' }]
      User.getAll.mockImplementationOnce(() => Promise.resolve(users))
      const response = await makeRequest(server, { method: 'GET' })
      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual(users)
      expect(User.getAll).toHaveBeenCalled()
    })

    it('should respond with 500 when the database call fails', async () => {
      User.getAll.mockImplementationOnce(() => Promise.reject(new Error()))
      const response = await makeRequest(server, { method: 'GET' })
      expect(response.statusCode).toEqual(500)
      expect(User.getAll).toHaveBeenCalled()
    })
  })
})
