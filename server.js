const express = require("express");
var app = express();
var http = require('http').createServer(app);

var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    // console.log("hello");
    socket.on('disconnect',function(){
        // console.log('user disconnected');
    });
    socket.on('cue', function(imgData){
        // console.log("peyechi");
        io.emit('cue',imgData);
    });
});

http.listen(3000, function(){
    console.log("listening on 3000");
});