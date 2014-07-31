var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var router = express.Router()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var keys = require('./keys')
var restaurants = ['Shake Shack', 'Capriottis', 'Grill Fish', 'Chipotle', 'Qdoba', 'Taylor Gourmet', 'Chopt', 'District Taco', 'Pei Wei', 'McDonalds', 'Potbelly', 'Noodles and Company', 'Julies Empanadas', 'Bub & Pops', 'Sweetgreen', 'Moby Dick', 'Panera', 'Roti', 'Jimmy Johns']

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gif Oracle
app.post('/gifme', function(req, res) {
  // Get info from the post
  var text = req.body.text.split('-c')
  var gifQuery = text[0]
  // Get gifs from giphy 
  request('http://api.giphy.com/v1/gifs/search?q='+gifQuery+keys.gifme, function(err, response, body) {
    if (err) res.send(err)
    var b = JSON.parse(body), random = Math.floor(Math.random() * (b.data.length - 1)) + 0
    var payload;
    var url = b.data[random].url
      , user = req.body.user_name
      , caption = text[1]
      , gifTitle = text[0];
    if (caption) payload ="Title: "+ gifTitle +'\nSent By '+ user + "\n~'"+caption+"'\n<"+url+">" ;
    else if (!caption) payload = "Title: "+ gifTitle +'\nSent By '+ user + "\n<"+url+">" ;
    var options = {
      url: 'Your web hook integration url token here',
      method: "POST",
      json: {"text":payload, "username":"the bot name", "icon_emoji":":an emoji:"}
    }
    // Send gifs to slack channel
    request(options, function(err) {
      if (err) res.send(err);
    })
    res.send('Gif sent.')
  })
})

app.use(router)
app.listen(process.env.PORT || 3000, function() {
  console.log('listining on port 3000')
})
