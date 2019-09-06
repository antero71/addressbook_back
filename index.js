const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const generateId = () => {
  const maxId = contacts.length > 0
    ? Math.max(...contacts.map(n => n.id))
    : 0
  return maxId + 1
}

let contacts = [
  {
    id:1,
    name: "add new contact",
    street: "Koulukatu 4",
    phone:"040222333",
    email:"test@gmail.com"
  },
  {
    id: 2,
    name: "Aku Ankka",
    address: "Ankkalinnantie 33",
    phone:"050-4453355",
    email:"aku.ankka@ankkalinna.com"
  },
  {
    id: 3,
    name: "Lumikki",
    address: "Peltotie 47",
    phone:"0442672333",
    email:"lumikki22@gmail.com"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/contacts', (req, res) => {
  res.json(contacts)
})

app.get('/contacts/:id', (request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.find(contact => contact.id === id)
  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.delete('/contacts/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(contact => contact.id !== id)

  response.status(204).end()
})

app.post('/contacts', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const contact = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  contacts = contacts.concat(contact)

  response.json(contact)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})