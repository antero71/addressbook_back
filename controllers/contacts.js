const contactsRouter = require('express').Router()
const Contact = require('../models/contact')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../utils/token_validation')

  contactsRouter.get('/', async (request, response, next) => {

    const token = getTokenFrom(request)

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)

      if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }

      const contacts = await Contact
        .find({}).populate('User', { username: 1, name: 1 })

      response.json(contacts.map(contact => contact.toJSON()))
    }catch(exception){
      next(exception)
    }
})

contactsRouter.get('/:id', async (request, response, next) => {

  const token = getTokenFrom(request)

  try{
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

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

  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    console.log('tokenId:', decodedToken.id)

    const user = await User.findById(decodedToken.id)

    console.log('user: ',user)

    const contact = new Contact({
      name: body.name,
      address: body.address,
      phone: body.phone,
      email: body.email,
      date: new Date(),
      user: user._id
    })

  
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