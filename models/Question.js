const Sequelize = require('sequelize')
const connection = require('../config/database')

const Question = connection.define('question', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  question: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

Question.sync({force: false})

module.exports = Question