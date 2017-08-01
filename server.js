var express = require('express');
var app = express();

app.get('/newUser', function (req, res, err){
    var responses = [{"status":"success"}, {"status":"error", "reason":"Some reason of error"}, {"status":"progress", "timeout": "10000"}, {"status":"progress", "timeout": "12000"}, {"status":"progress", "timeout": "15000"}]
    if (err) console.error(err);
    var i = Math.floor(Math.random()*5);   
    res.jsonp(JSON.stringify(responses[i]));
});


app.listen(8080, () =>{
    console.log('application listening on port 8080');
});