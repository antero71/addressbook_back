const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://databasecontibutor:${password}@cluster-addressbook-4cw8s.mongodb.net/contacts-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const contactSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  phone: String,
  date: Date
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  name: "Antero",
  address: "Riihitie, Helsinki",
  email: "testi@foo.com",
  phone: "+358 44 003 9939",
  date: new Date()
})

contact.save().then(response => {
  console.log('contact saved!');
  mongoose.connection.close();
})