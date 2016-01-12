var MONGOLAB_URI="mongodb://example:example@ds037415.mongolab.com:37415/url-shortener";
var DET = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/;


var mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();

mongo.connect(MONGOLAB_URI, function(err, db) {
  if(err)
    return console.dir(err);
    
  console.log("Connected to Mongolab DB");
    
  app.set('port', (process.env.PORT || 5000));
  app.set('view engine', 'jade');

  // Routes
  app.get("/", function(request, response) {
    response.render("index");
  });

  app.get("/*", function(request, response) {
    var url = request.params[0];
    var short_url = "";
    var json = JSON.stringify({"error":"URL invalid"});

    if(url.match(DET) === null)
      response.send(json);  
    
    shorten(db,url,function(err,resp){
      if(err)
        console.error("Error: "+err);
      else
        json = JSON.stringify({"original_url":url,"short_url":resp});
        
      response.send(json);            
    });
    
  });


  function shorten(db, url, callback)
  {
    var col = db.collection('shorten');
    col.find({
      url: url
    }).toArray(function(err, documents) {
      console.log("finished looking for url...");
      var resp = "";
      if(err)
        callback(err,null);
      else if(documents.length)
        resp = documents[0].short;
      else
      {
        //TODO: Create new short url
      }

      db.close();
      callback(null,resp);
    })
  }
  app.listen(app.get('port'));
});


