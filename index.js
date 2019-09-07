const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())


app.use(morgan('short'))

app.use(cors())

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

app.get('/api', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/contacts', (req, res) => {
  res.json(contacts)
})

app.get('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.find(contact => contact.id === id)
  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(contact => contact.id !== id)

  response.status(204).end()
})

app.post('/api/contacts', (request, response) => {
  const body = request.body

  

  const name = contacts.find(contact => contact.name === body.name)

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

  contacts = contacts.concat(contact)

  response.json(contact)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})