require('dotenv').config()
const express = require('express')
const Contact = require('./models/contact')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(bodyParser.json())
app.use(morgan('short'))

app.use(cors())

mongoose.set('useFindAndModify', false)

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/api', (request, response) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/contacts', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
  .catch(error => {
    console.log(error)
    response.status(404).end()
  })
})

app.get('/api/contacts/:id', (request, response) => {
 // const id = Number(request.params.id)
  Contact.findById(request.params.id)
  .then(contact => {
    if (contact){
      response.json(contact.toJSON())
    } else {
      response.status(404).end() 
    }
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/contacts', (request, response) => {
  const body = request.body

  const name = Contact.find(contact => contact.name === body.name)

  if (name) {
    return response.status(400).json({
      error: 'name is allready in contacts'
    })
  }

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.phone && !body.email) {
    return response.status(400).json({
      error: 'phone or email is mandatory'
    })
  }

  const contact = {
    name: body.name,
    address: body.address,
    phone: body.phone,
    email: body.email,
    date: new Date(),
    id: generateId(),
  }

  contact.save().then(savedContact => {
    response.json(savedContact.toJSON())
  })
})

app.put('/api/contacts/:id', (request, response, next) => {
  const body = request.body

  const note = {
    name: body.content,
    address: body.important,
    phone: body.phone,
    email: body.email,
    date: new Date()
  }

  Contact.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedContact => {
      response.json(updatedContact.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})