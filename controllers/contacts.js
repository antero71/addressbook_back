const contactsRouter = require('express').Router()
const Contact = require('../models/contact')

contactsRouter.get('/', async (request, response) => {
  const contacts = await Contact.find({})
  response.json(contacts.map(contact => contact.toJSON()))
})

contactsRouter.get('/:id', async (request, response, next) => {
  try{
    const contact = await Contact.findById(request.params.id)
    if (contact) {
      response.json(contact.toJSON())
    } else {
      response.status(404).end()
    }
  } catch(exception){
    next(exception)
  }
})

contactsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const contact = new Contact({
    name: body.name,
    address: body.address,
    phone: body.phone,
    email: body.email,
    date: new Date(),
  })

  try{
    const savedContact = await contact.save()
    response.json(savedContact.toJSON())
  }catch(exception){
    next(exception)
  }
})

contactsRouter.delete('/:id', async (request, response, next) => {
  try{
    await Contact.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }catch(exception){
    next(exception)
  }
})

contactsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const contact = new Contact({
    name: body.name,
    address: body.address,
    phone: body.phone,
    email: body.email,
    date: new Date(),
  })

  try{
    const updatedContact = await Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    response.json(updatedContact.toJSON())
  }catch(exception){
    next(exception)
  }
})

module.exports = contactsRouter