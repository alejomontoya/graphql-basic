'use strict'

function errorHandler(error) {
  console.error(error)
  throw new Error('Faild in the operation of server')
}

module.exports = errorHandler