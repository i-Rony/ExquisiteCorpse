const express = require("express");
var app = express();
var http = require('http').createServer(app);
const PORT = process.env.PORT || 5000;
var io = require('socket.io')(http);

var rooms = [];
/*
 room = {
     'room id' : 12345,
     'strength : 2,
     'players' : []
 }
*/

app.use(express.static(__dirname));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
    // console.log("hello");
    socket.on('disconnect',function(){
        // console.log('user disconnected');
    });
    socket.on('cue', function(imgData,rID,id){
        // console.log("peyechi");
        io.emit('cue',imgData,rID,id);
    });
    socket.on('joinroom', function(roomID, socketID){
        
        var f=true;
        var indu=-1;
        for(var i=0;i<rooms.length;i++)
        {
            //console.log(rooms[i]['room ID'] +"and" + roomID);
            if(rooms[i]['room ID'] == roomID)
            { 
                f=false; 
                indu=i;
            }
        }
        if(f)
        { 
            //console.log("\nf is true\n");
            var newroom = {
                'room ID' : roomID,
                'strength' : 1,
                'players' : [socketID]
            }
            rooms.push(newroom);
            io.emit('roomsuccess',roomID,socketID,true);
        }
        else
        {
            //console.log("f is false");
            if(rooms[indu]['strength']==2)
                io.emit('roomfull',socketID);
            else
            {
                rooms[indu]['strength']=2;
                rooms[indu]['players'].push(socketID);
                io.emit('roomsuccess',roomID,socketID,false);
            }
        }
        //console.log(rooms);
    });
});

http.listen(PORT, () => console.log(`Listening on ${ PORT }`))