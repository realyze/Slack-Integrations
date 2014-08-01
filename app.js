var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var router = express.Router()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/gifme', function(req, res) {
  // Get info from the post
  var tag = req.query.text
  if (!tag) {return res.send(500, 'missing tag');}

  // Get gifs from giphy 
  request('http://api.giphy.com/v1/gifs/random?tag=' + tag + 
      "&api_key=" + process.env.GIPHY_API_KEY, function(err, response, body) {
    if (err) { return res.send(500, err); }
    var b = JSON.parse(body);
    var obj = b.data

    var options = {
      url: 'https://salsita.slack.com/services/hooks/incoming-webhook?token=' + process.env.SLACK_TOKEN,
      method: "POST",
      json: {
        text: 'http://media.giphy.com/media/' + obj.id + '/giphy.gif',
        channel: '#' + req.query.channel_name,
        username: req.query.user_name + "gifsson says \"" + tag + "\"",
        icon_emoji: ":cage:"
      }
    }
    // Send gifs to slack channel
    request(options, function(err) {
      if (err) {
        return res.send(err);
      } else {
        res.send(200);
      }
    })
  })
})

app.use(router)
app.listen(process.env.PORT || 3000, function() {
  console.log('app listening');
})
