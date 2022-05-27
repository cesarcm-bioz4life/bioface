var express = require('express');
var app = express();
const path = require('path');

app.use(express.static('./'));
//app.use(express.static(path.join(__dirname+'/')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});                                

app.get("/video", (req, res) => {
    res.sendFile(path.join(__dirname+'/client.html'));
});                                

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port %s', port);
});

