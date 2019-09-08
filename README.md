# addressbook_back
Yhteystietosovelluksen back-end osuus.

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
`
{
  "error": "invalid username or password"
}
`
Muutoin paluusanomassa tulee käyttäjälle generoitu jwt token, jota joissakin rajapinnooissa käytetään käyttäjän tunnistukseen.

