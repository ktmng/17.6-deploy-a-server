//17.6 deploy a server practice 
// deploying to heroku
// ------------------------ 0 -----------------------------------
// - hide secrets
// - have .env files listed in .gitignore
// - use variables like process.env.API_TOKEN instead of actual value
// ------------------------ 0 -----------------------------------
require('dotenv').config()
// ------------------------ 3 -----------------------------------
//- remove unnecessary console logs 
//console.log(process.env.API_TOKEN)
// ------------------------ 3 -----------------------------------
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const POKEDEX = require('./pokedex.json')

const app = express()

// ------------------------ 2 -----------------------------------
//- make your code adapt to its environment by using a different 
//  environmental variable called NODE_ENV
//- NODE_ENV determines if the application is running in production 
//  or some other environment. 
//- When we deploy to production, Heroku will set this environmental 
//  variable to a value of "production". So, we can check to see if 
//  the NODE_ENV is set to "production" or not, and set the value for 
//  morgan as appropriate.
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
// ------------------------ 2 -----------------------------------
app.use(helmet())
app.use(cors())

// ------------------------ 1 -----------------------------------
//change PORT to respect an environmental variable if available
const PORT = process.env.PORT || 8000
// ------------------------ 1 -----------------------------------
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})



app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
})
  

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]
function handleGetTypes(req, res) {
  res.json(validTypes)
}

app.get('/types', handleGetTypes)

function handleGetPokemon(req, res) {
    res.send('Hello, Pokemon!')
}

app.get('/pokemon', function handleGetPokemon(req, res) {
    let response = POKEDEX.pokemon;
  
    // filter our pokemon by name if name query param is present
    if (req.query.name) {
      response = response.filter(pokemon =>
        // case insensitive searching
        pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
      )
    }
  
    // filter our pokemon by type if type query param is present
    if (req.query.type) {
      response = response.filter(pokemon =>
        pokemon.type.includes(req.query.type)
      )
    }
  
    res.json(response)
})


// ------------------------ 4 -----------------------------------
// - hide sensitive server error msgs 
// - set up an error-handling middleware to catch any server errors 
//   that occur and print a more user-friendly error in production. 
// - whenever a middleware has a list of 4 parameters,
//   express assigns it to error handling 
// - error-handling middleware should always be the last middleware in pipeline

// 4 parameters in middleware, express knows to treat this as error handler
app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
})
// ------------------------ 4 -----------------------------------
  