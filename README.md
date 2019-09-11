# addressbook_back
Yhteystietosovelluksen back-end osuus.

## Käytetetyt lähteet

Sovellus on kehitetty pitkälti ottaen mallia Helsingin Ylipiston fullstack kurssin materiaalista. Kurssi löytyy osoitteesta https://fullstackopen.com/

# API rajapinnat

## Käyttäjän lisääminen

```
post https://safe-plateau-98676.herokuapp.com/api/users HTTP/1.1
Content-Type: application/json

{
  "username": "username",
  "name": "Sipuli Keitto",
  "password": "samplexyzkljjh19A"
}
```
Samalla `username`:llä ei voi lisätä kahta tai useampaa käyttäjää.
 

## Käyttäjän kirjautuminen

```
post https://safe-plateau-98676.herokuapp.com/api/login
Content-Type: application/json

{
  "username": "username",
  "password": "password"
}
```

Jos kirjautumistiedot ovat väärin tai käyttäjää ei löydy, annetaan virheilmoitus
```
{
  "error": "invalid username or password"
}
```
Muutoin paluusanomassa tulee käyttäjälle generoitu jwt token, jota joissakin rajapinnooissa käytetään käyttäjän tunnistukseen.

## Yhteystiedon lisääminen
```
post http://localhost:3001/api/contacts HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...

{
  "name": "Tiina Siili",
  "address": "Siilitie 4, Kauniainen",
  "email":"tiina@gmail.com",
  "userId":"5d75111e9b9626e6ee07f4db"
}
```

userId kentän sisältö pitää olla sen käyttäjän id, joka on lisäämässä yhteystietoa.

## Puutteita ja kehityskohteita

- Yhteystietolistasta ei pääse linkillä tarkempiin tietoihin, vaan koko yhteystiedon
asiasisältö on listassa mukana.
- Testit pitää korjata.
- Testejä pitää tehdä lisää.
- express-jwt token kirjaston käyttöönotto
- uhkamallinnus on tekemättä.
- - uhkamallinnuksessa havaitut uhat pitää arvioida ja tarvittaessa korjata.
- 
