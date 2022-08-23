const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./config/database')
const questionModel = require('./models/Question')
const answerModel = require('./models/Answer')

connection
.authenticate()
.then(() => {
  console.log('DB Connection established')
})
.catch(err => {
  console.log(err)
})

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  questionModel.findAll({raw: true, order: [
    ['createdAt', 'DESC']
  ]}).then(questions => {
    res.render('index', {
      questions: questions
    })
  })
})

app.get('/askme', (req, res) => {
  res.render('askme')
})

app.post('/save', (req, res) => {
  const title = req.body.title
  const question = req.body.question 

  if(title && question) {
    questionModel.create({
      title: title,
      question: question
    }).then(() => {
      res.redirect('/')
    })
  } else {
    window.alert('Please enter a title and a question')
  }
})

app.get('/question/:id', (req, res) => {
  const id = req.params.id
  questionModel.findOne({
    where: {id: id},
  }).then(question => {
    if(question) {
      answerModel.findAll({
        where: {questionId: question.id},
        order: [
          ['createdAt', 'DESC']
        ]
      }).then((answers) => {
        res.render('question', {
          question: question,
          answers: answers
        })
      })
    } else {
      res.redirect('/')
    }
  })
})

app.post('/answer' , (req, res) => {
  const answer = req.body.answer
  const questionId = req.body.questionId

  if(answer) {
    answerModel.create({
      answer: answer,
      questionId: questionId
    }).then(() => {
      res.redirect('/question/' + questionId)
    })
  } else {
    window.alert('Please enter a answer')
  }
})

app.listen(8080, () => {
  console.log('listening on port 8080')
})