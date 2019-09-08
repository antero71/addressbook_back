const Contact = require('../models/contact')
const User = require('../models/user')

const initialContacts = [
  {
    name: 'Risto',
    phone: '040-34342333',
    address: 'Rataskatu 4, Helsinki'
  },
  {
    name: 'Liisa',
    email: 'liisa123456778@gmail.com',
  },
]

const nonExistingId = async () => {
  const contact = new Contact({ name: 'willremovethissoon' })
  await contact.save()
  await contact.remove()

  return contact._id.toString()
}

const contactsInDb = async () => {
  const contacts = await Contact.find({})
  return contacts.map(contact => contact.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialContacts, contactsInDb, nonExistingId, usersInDb
}