'use strict'

const mongoose = require('mongoose')
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
    return UserModel.find({})
  },

  async getOne(id) {
    return UserModel.findById(id)
  },

  async create(user) {
    return new UserModel(user).save()
  },

  async edit(id, user) {
    return UserModel.findByIdAndUpdate(id, user)
  },

  async delete(id) {
    return UserModel.findByIdAndRemove(id)
  },
}

module.exports = User
