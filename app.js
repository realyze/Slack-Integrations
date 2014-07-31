var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var router = express.Router()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var restaurants = ['Shake Shack', 'Capriottis', 'Grill Fish', 'Chipotle', 'Qdoba', 'Taylor Gourmet', 'Chopt', 'District Taco', 'Pei Wei', 'McDonalds', 'Potbelly', 'Noodles and Company', 'Julies Empanadas', 'Bub & Pops', 'Sweetgreen', 'Moby Dick', 'Panera', 'Roti', 'Jimmy Johns']

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gif Oracle
app.get('/gifme', function(req, res) {
  // Get info from the post
  var text = req.query.text
  if (!text) {return res.send(500, 'missing tag');}
  // Get gifs from giphy 
  request('http://api.giphy.com/v1/gifs/search?q='+ text + "&api_key=" + process.env.GIPHY_API_KEY, function(err, response, body) {
    if (err) { return res.send(500, err); }
    var b = JSON.parse(body);
    console.log(b);
    var random = Math.floor(Math.random() * (b.data.length - 1)) + 0
    var payload;
    var obj = b.data[random];

    payload = 'http://media.giphy.com/media/' + obj.id + 'giphy.gif'
    var options = {
      url: 'https://salsita.slack.com/services/hooks/incoming-webhook?token=' + process.env.SLACK_TOKEN,
      method: "POST",
      json: {
        text: payload,
        channel: '#' + b.channel_name,
        username:"GiphyBot",
        icon_emoji:":cage:"
      }
    }
    // Send gifs to slack channel
    request(options, function(err) {
      if (err) {
        return res.send(err);
      } else {
        res.send('Gif sent.');
      }
    })
  })
})

app.use(router)
app.listen(process.env.PORT || 3000, function() {
  console.log('app listening');
})
