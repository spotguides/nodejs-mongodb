'use strict'

const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const { ObjectId } = require('bson')
const { makeRequest } = require('@banzaicloud/service-tools/dist/helper')
const User = require('../../../models/User')
const { getById: handler } = require('./')

jest.mock('../../../models/User', () => ({
  getOne: jest.fn(),
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
    router.get('/:id', handler)
    app.use(bodyParser())
    app.use(router.routes())
    app.use(router.allowedMethods())
    server = http.createServer(app.callback())
    id = new ObjectId().toHexString()
    user = {
      id,
      email: 'user@email.com',
      username: 'user',
      firstName: 'First',
      lastName: 'Last',
    }
  })

  describe('Get a user by id', () => {
    it('should respond with 200 and the user when it exists', async () => {
      User.getOne.mockImplementationOnce(() => Promise.resolve(user))
      const response = await makeRequest(server, { method: 'GET', endpoint: `/${user.id}` })
      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual(user)
      expect(User.getOne).toHaveBeenCalledWith(user.id)
    })

    it('should respond with 404 when the user does not exist', async () => {
      User.getOne.mockImplementationOnce(() => Promise.resolve())
      const response = await makeRequest(server, { method: 'GET', endpoint: `/${user.id}` })
      expect(response.statusCode).toEqual(404)
      expect(User.getOne).toHaveBeenCalledWith(user.id)
    })

    it('should respond with 500 when the database call fails', async () => {
      User.getOne.mockImplementationOnce(() => Promise.reject(new Error()))
      const response = await makeRequest(server, { method: 'GET', endpoint: `/${user.id}` })
      expect(response.statusCode).toEqual(500)
      expect(User.getOne).toHaveBeenCalledWith(user.id)
    })
  })
})
