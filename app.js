
var express = require('express')
  , mongolian = require('mongolian')
  , app = express.createServer()

var MONGO_DB = process.env.MONGOHQ_URL || 'mongodb://localhost/the-issues'
var PORT = process.env.PORT || 2222

var db = new mongolian(MONGO_DB)
var ObjectId = mongolian.ObjectId
ObjectId.prototype.toJSON = ObjectId.prototype.toString

app.configure('development', function() {
  app.use(express.bodyParser())
  app.use(express.static(__dirname + '/public'))
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
});








//// JSON API ////
var collection = db.collection("issues")

app.get("/issues", function(req, res) {
  collection.find().toArray(function(err, issues) {
    res.send(issues)
  })
})

app.get("/issues/:id", function(req, res) {
  collection.findOne({_id: new ObjectId(req.params.id)}, function(err, issue) {
    res.send(issue)
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








app.listen(PORT, function() {
  console.log("Listening on " + PORT)
});

