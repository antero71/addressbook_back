const contactsRouter = require('express').Router()
const Contact = require('../models/contact')

contactsRouter.get('/', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts.map(contact => contact.toJSON()))
  })
})

contactsRouter.get('/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

contactsRouter.post('/', (request, response, next) => {
  const body = request.body

  const contact = new Contact({
    name: body.name,
    address: body.address,
    phone: body.phone,
    email: body.email,
    date: new Date(),
  })

  contact.save()
    .then(savedContact => {
      response.json(savedContact.toJSON())
    })
    .catch(error => next(error))
})

contactsRouter.delete('/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

contactsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    content: body.content,
    important: body.important,
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact.toJSON())
    })
    .catch(error => next(error))
})

module.exports = contactsRouter