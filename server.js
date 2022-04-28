const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/ShortUrl')
require('dotenv').config()
const app = express()

mongoose.connect(process.env.MONGO_URI), {
    useNewUrlParser: true, useUnifiedTopology: true
}
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use( express.static( "public" ) );

app.listen(process.env.PORT || 5000)
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find({})
    res.render('index',{shortUrls: shortUrls})

})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    try {
        const shortId = req.params.shortUrl;
        const shortUrl = await ShortUrl.findOne({ short: shortId })
        console.log('short url :', shortUrl);
        if (shortUrl == null) return res.sendStatus(404)
        shortUrl.clicks++
        console.log(shortUrl);
        shortUrl.save();
        res.redirect(shortUrl.full)   
    } catch (error) {
        console.log(error);
      res.status(404).send("something went wrong")  
    }
   
})