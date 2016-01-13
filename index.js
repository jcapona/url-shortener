var MONGOLAB_URI="mongodb://example:example@ds037415.mongolab.com:37415/url-shortener";
var DET = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/;


var mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();

// ROUTES 
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'jade');

app.get("/", function(request, response) {
  response.render("index");
});

app.get("/new/*", function(request, response) {
  var url = request.params[0];
  var short_url = "";
  var json = JSON.stringify({"error":"URL invalid"});

  if(url.match(DET) === null)
    response.end(json);  
  
  shorten(url,function(err,resp){
    if(err)
      console.error("Error: "+err);
    else
      json = JSON.stringify({"original_url":url,"short_url":resp});
    
    response.end(json);
  });  
});

app.get("/*", function(request, response) {
  response.render("index");
});

app.listen(app.get('port'));


function shorten(url, callback)
{
  mongo.connect(MONGOLAB_URI, function(err, db) {
    if(err)
      return callback(err);
    else    
      console.log("Connected to Mongolab DB");

    var col = db.collection('shorten');
    col.find({
      url: url
    }).toArray(function(err, documents) {
      var resp = "";
      if(err) // On error
      {
        db.close();
        callback(err,null);
      }
      else if(documents.length) // When url already exists
      {
        resp = documents[0].short;
        db.close();
        callback(null,resp);
      }
      else // When it doesnt, create new document in collection
      {
        col.count({}, function(err, short_url){
            if(err) 
            {
              db.close();
              return callback(err);
            }

            col.insert(({"url":url,"short":short_url}), function(err, result) {
              if(err)
              {
                db.close();
                return callback(err);
              }
             
              resp = short_url;
              db.close();
              callback(null,resp);
            });
        });
      }
    })
  });       
}
