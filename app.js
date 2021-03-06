var bodyParser = require('body-parser');
var express = require('express');
var mongodb = require('mongodb');
    app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true}));

/*****************************************************
Function: mongo_insert_one()

Parameters: insertionDetails (Object)
              - url 'string'
              - collection 'string',
              - doc 'object'

Given the connection details, this function will insert a document into th re

Returns: int (1) on success, or string on failure

*****************************************************/
function mongo_insert_one(insertionDetails) {
    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(insertionDetails.url, function(err, db) {
        if(err) {
            return "Error, could not connect: " + err;
        } else {
            var collection = db.collection(insertionDetails.collection);
            collection.insert(insertionDetails.doc, function(err, result) {
                if(err) {
                    return "Error, unable to insert document: " + err
                } else {
                    return 1;
                }
            });
        }
    });
}
/*****************************************************
Function: mongo_read_collection()

Parameters: queryDetails, (object)
              - url, 'string'
              - collection, 'string'
*****************************************************/
function mongo_read_collection(queryDetails) {
  var MongoClient = require('mongodb').MongoClient;

  var url = queryDetails.url;
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('there was an error: ' + err);
        } else {
            console.log('Connection established to: ' + url);
            var collection = db.collection(queryDetails.collection);

            collection.find().toArray(function(err, result) {
                if(err) {
                    console.log(err);e
                } else if(result.length) {
                    console.log('Found: ', result);
                } else {
                    console.log('nothing found');
                }
            });
        }
    });
}
/* sample call of READ
mongo_read_collection({
  url : 'mongodb://localhost:27017/recipes',
  collection : 'recipes'
});*/
// allow access to public directory
app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));


app.get('/create_recipe', function(req, res) {
  var recipe_name = req.param('recipe_name'),
      ingredients = req.param('ingredients_list'),
      instructions = req.param('preparation');
  mongo_insert_one({
      url: 'mongodb://localhost:27017/recipes',
      collection: 'recipes',
      doc: {
        name : recipe_name,
        ingredients : ingredients.split('|'),
        prep : instructions
      }
  });
  res.send('success');
});

app.listen(3000, function() {
    console.log('app listening on port 3000');
});
