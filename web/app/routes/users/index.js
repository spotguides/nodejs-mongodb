'use strict'

const create = require('./create')
const del = require('./delete')
const edit = require('./edit')
const getAll = require('./getAll')
const getById = require('./getById')

module.exports = {
  create,
  edit,
  getAll,
  getById,
  delete: del,
}
