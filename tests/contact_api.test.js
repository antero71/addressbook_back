const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Contact = require('../models/contact')


const api = supertest(app)



beforeEach(async () => {
  await Contact.deleteMany({})

  let contactObject = new Contact(helper.initialContacts[0])
  await contactObject.save()

  contactObject = new Contact(helper.initialContacts[1])
  await contactObject.save()
})


test('contacts are returned as json', async () => {
  await api
    .get('/api/contacts')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all contact are returned', async () => {
  const response = await api.get('/api/contacts')

  expect(response.body.length).toBe(helper.initialContacts.length)
})

test('the first contact is Risto', async () => {
  const response = await api.get('/api/contacts')

  expect(response.body[0].name).toBe('Risto')
})

test('a specific contact is within the returned contacts', async () => {
  const response = await api.get('/api/contacts')

  const contents = response.body.map(r => r.name)

  expect(contents).toContain(
    'Liisa'
  )
})

test('a valid contact can be added ', async () => {
  const newContact = {
    name: 'Lasse',
    address: 'Liitupolku 22, Oulu',
    phone: '045-90332333'
  }

  await api
    .post('/api/contacts')
    .send(newContact)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/contacts')



  const contactsAtEnd = await helper.contactsInDb()

  const names = contactsAtEnd.map(r => r.name)
  const phones = contactsAtEnd.map(r => r.phone)

  expect(contactsAtEnd.length).toBe(helper.initialContacts.length + 1)
  expect(names).toContain(
    'Lasse'
  )
  expect(phones).toContain(
    '045-90332333'
  )
})

test('contact without name is not added', async () => {
  const newContact = {
    address: 'Liitupolku 22, Oulu',
    phone: '045-90332333'
  }

  try{
    await api
      .post('/api/contacts')
      .send(newContact)
      .expect(400)
  } catch(exception){
    console.log(exception)
    next(exception)
  }
  const response = await api.get('/api/contacts')

  expect(response.body.length).toBe(helper.initialContacts.length)
})

test('a specific contact can be viewed', async () => {
  const contactsAtStart = await helper.contactsInDb()

  const contactToView = contactsAtStart[0]

  const resultcontact = await api
    .get(`/api/contacts/${contactToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultcontact.body).toEqual(contactToView)
})

test('a contact can be deleted', async () => {
  const contactsAtStart = await helper.contactsInDb()
  const contactToDelete = contactsAtStart[0]

  await api
    .delete(`/api/contacts/${contactToDelete.id}`)
    .expect(204)

  const contactsAtEnd = await helper.contactsInDb()

  expect(contactsAtEnd.length).toBe(
    helper.initialContacts.length - 1
  )

  const names = contactsAtEnd.map(r => r.name)

  expect(names).not.toContain(contactToDelete.name)
})

afterAll(() => {
  mongoose.connection.close()
})