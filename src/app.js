const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = 3000

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
// Setup static directory to serve
app.use(express.static(publicDirPath))

// Express routes
// req(request) = object contening incoming request to the server
// res(response) = a bunch of methods allowing us to customize our answer
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App', 
        name: 'Jose Martinez'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me', 
        name: 'Jose Martinez'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is some helpful text.',
        title: 'Help',
        name: 'Jose Martinez'
    })
})

// sending a JSON response
app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address!'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecast) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast,
                location, 
                address: req.query.address
            })
        })
    })
})

/* app.get('products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
}) */

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help articule not found!',
        title: '404',
        name: 'Jose Martinez'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'My 404 page',
        title: '404',
        name: 'Jose Martinez'
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))