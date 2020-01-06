const mongoose = require('mongoose')
const tracing = require('@opencensus/nodejs')
const { SpanKind, CanonicalCode } = require('@opencensus/core')
require('../database')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
})
userSchema.virtual('id').get(function getId() {
  return this._id.toHexString()
})
userSchema.set('toJSON', {
  virtuals: true,
})

const UserModel = mongoose.model('users', userSchema)

const User = {
  async getAll() {
    const span = tracing.tracer.startChildSpan('User.getAll', SpanKind.SERVER)

    try {
      return await UserModel.find({})
    } catch (err) {
      span.setStatus(CanonicalCode.INTERNAL, err.message)
      return null
    } finally {
      span.end()
    }
  },

  async getOne(id) {
    const span = tracing.tracer.startChildSpan('User.getOne', SpanKind.SERVER)
    span.addAttribute('id', id)

    try {
      return await UserModel.findById(id)
    } catch (err) {
      span.setStatus(CanonicalCode.INTERNAL, err.message)
      return null
    } finally {
      span.end()
    }
  },

  async create(user) {
    const span = tracing.tracer.startChildSpan('User.create', SpanKind.SERVER)
    span.addAttribute('user', JSON.stringify(user))

    try {
      return await new UserModel(user).save()
    } catch (err) {
      span.setStatus(CanonicalCode.INTERNAL, err.message)
      return null
    } finally {
      span.end()
    }
  },

  async edit(id, user) {
    const span = tracing.tracer.startChildSpan('User.edit', SpanKind.SERVER)
    span.addAttribute('id', id)
    span.addAttribute('user', JSON.stringify(user))

    try {
      return await UserModel.findByIdAndUpdate(id, user)
    } catch (err) {
      span.setStatus(CanonicalCode.INTERNAL, err.message)
      return null
    } finally {
      span.end()
    }
  },

  async delete(id) {
    const span = tracing.tracer.startChildSpan('User.delete', SpanKind.SERVER)
    span.addAttribute('id', id)

    try {
      return await UserModel.findByIdAndRemove(id)
    } catch (err) {
      span.setStatus(CanonicalCode.INTERNAL, err.message)
      return null
    } finally {
      span.end()
    }
  },
}

module.exports = User
