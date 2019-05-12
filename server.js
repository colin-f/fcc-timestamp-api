// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();


//Logger
app.use(function(req, res, next){
  console.log(req.method+" "+req.path+" - "+req.ip);
  next();
});


// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html'); 
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// API endpoint for UTC date string
app.route("/api/timestamp/:date_string").get( function(req, res, next){
  
  // Get url param
  let dateString = req.params.date_string;
  console.log(dateString);
  
  // UTC Date YMD & Millisec Format RegEx
  let utcDateRegYMD = new RegExp("[0-9]{4}-(?=0[0-9]|1[012]-(?=[012][0-9]|[3][01]))");
  let utcDateRegMil = new RegExp("^-?(864[0]{13}|86[0-3][0]{13}|8[0-5][0-9]{14}|[0-7]0-9]{15}|[0-9]{0,15})"); 
  
 
  if(utcDateRegYMD.test(dateString)){//matches Year-Month-Day format
    req.time = new Date(dateString);
    req.json = {"unix" : req.time.getTime(),  "utc" : req.time.toUTCString()};
    
  }else if(utcDateRegMil.test(dateString)){//matches millisecond format
    req.time= new Date(dateString);
    req.json = {"unix" : req.time.getTime(), "utc" : req.time.toUTCString()};
    
  }else{//doesn't match UTC formats
    req.json = {"error" : "Invalid Date"};
  }
  next();
  
},function (req, res){//callback
  
  res.json(req.json);
  
});

// API endpoint for new UTC date string
app.route("/api/timestamp/").get(function(req, res){
  let curDate = new Date();
  res.json({"unix" : curDate.getTime(), "utc" : curDate.toUTCString()});
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});