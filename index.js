 var DET = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/;

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'jade');

app.get("/", function(request, response) {
  response.render("index");
});

app.get("/*", function(request, response) {
  var url = request.params[0];
  var short_url = "";
  var json = JSON.stringify({"error":"URL invalid"});

  if(url.match(DET) === null)
    response.end(json);  
  

  var json = JSON.stringify({"original_url":url,"short_url":short_url});
  response.end(json);
});

app.listen(app.get('port'));

