
var express = require('express')
  , mongolian = require('mongolian')
  , app = express.createServer()

var MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/the-issues'
var PORT = process.env.PORT || 2222

var db = new mongolian(MONGO_DB)

app.configure('development', function() {
  app.use(express.bodyParser())
  app.use(express.static(__dirname + '/public'))
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
});

// app.get('/welcome', function(request, response) {
//   var html = path.normalize(__dirname + '/../../public/index.html');
//   response.sendfile(html);
// });



// JSON API
var collection = db.collection("issues")

app.get("/issues", function(req, res) {
  collection.find().toArray(function(err, issues) {
    res.send(issues)
  })
})

app.post("/issues", function(req, res) {
  var issue = req.body
  issue.firstVotes = 0
  issue.secondVotes = 0
  collection.save(issue, function(err, data) {
    res.send(200)
  })
})

// send everything to index, so the angular router can use html5 urls
app.get("*", function(req, res) {
  res.sendfile(__dirname + "/public/index.html")
})

app.listen(PORT, function() {
  console.log("Listening on " + PORT)
});

