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
     'players' : [],
     'images' : []
 }
*/

app.use(express.static(__dirname));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
    // console.log("hello");
    socket.on('disconnect',function(){
        var sID = socket.id;
        for(var i=0;i<rooms.length;i++)
        {
            var indexu = rooms[i]['players'].indexOf(sID);
            if(indexu>=0)
            { 
                rooms[i]['strength'] = rooms[i]['strength'] - 1;
                rooms[i]['players'].splice(indexu,1);
                if(rooms[i]['strength'] == 0)
                {
                    rooms.splice(i,1);
                }
            }
        }
        //console.log(rooms);
    });


    socket.on('cue', function(imgData,rID,id,bessa){
        io.emit('cue',imgData,rID,id);
       //rooms[rID]['images'].push(bessa);
        for(var i=0;i<rooms.length;i++)
        {
            if(rooms[i]['room ID'] == rID)
             {   
                 rooms[i]['images'].push(bessa);
                 break;
             }
        }
        //console.log(rooms);
    });

    socket.on('sesh', function(roomID){
        for(var i=0;i<rooms.length;i++)
        {
            if(rooms[i]['room ID'] == roomID)
             {   
                 io.emit('sesh',roomID,rooms[i]['images']);
                 //console.log(rooms[i]['images'][0]);
             }
        }
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
                'players' : [socketID],
                'images' : []
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