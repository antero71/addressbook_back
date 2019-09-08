const contactsRouter = require('express').Router()
const Contact = require('../models/contact')
const User = require('../models/user')

contactsRouter.get('/', async (request, response) => {
  const contacts = await Contact
    .find({}).populate('User', { username: 1, name: 1 })

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

  const user = await User.findById(body.userId)

  const contact = new Contact({
    name: body.name,
    address: body.address,
    phone: body.phone,
    email: body.email,
    date: new Date(),
    user: user._id
  })

  try{
    const savedContact = await contact.save()
    user.contacts = user.contacts.concat(savedContact._id)
    await user.save()
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