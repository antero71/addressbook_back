const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Contact = require('../models/contact')

const api = supertest(app)

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

beforeEach(async () => {
  await Contact.deleteMany({})

  let contactObject = new Contact(initialContacts[0])
  await contactObject.save()

  contactObject = new Contact(initialContacts[1])
  await contactObject.save()
})


test('contacts are returned as json', async () => {
  await api
    .get('/api/contacts')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are five contacts', async () => {
  const response = await api.get('/api/contacts')

  expect(response.body.length).toBe(2)
})

test('the first contact is Risto', async () => {
  const response = await api.get('/api/contacts')

  console.log('name ',response.body)

  expect(response.body[0].name).toBe('Risto')
})

afterAll(() => {
  mongoose.connection.close()
})