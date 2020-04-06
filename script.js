var socket = io();
window.onload = function () {

  window.scrollTo(0, 0);
    // Definitions
    var imgarray = [];
    var savedHash;

    var boudi = document.getElementsByTagName("body")[0];
    boudi.scrollTo(0, 0);
    var pauseBanner = document.getElementById('pause');
    var genButton = document.getElementById('gen');
    var undoButton = document.getElementById('undo');
    var clearButton = document.getElementById('clear');
    var brush = document.getElementById('brush');
    var eraser = document.getElementById('eraser');
    var canvas = document.getElementById("halo");
    var ctx = canvas.getContext("2d");
    var roombox = document.getElementById("roomID");
    var makeroom = document.getElementById("makeroom");
    var roominterface = document.getElementById("mroom");
    var saviorvi = document.getElementById("saveit");
    var picasso = document.getElementById("downs");
    var kesto = document.getElementById("final").getContext("2d");
    var roomID;
    var mobguard = document.getElementById("mobile");
    var tolon = document.getElementById("tolon");

    var tash = document.getElementById("cont");
    var namon = document.getElementById("namon");


    tolon.addEventListener("click", function(){
      tash.style.top = (tash.offsetTop-15) + "px";
    });
    namon.addEventListener("click", function(){
      tash.style.top = (tash.offsetTop+15) + "px";
    });


    // defaults
    var mouseX = 0;
    var mouseY = 0;
    ctx.lineWidth = 5; // initial brush width
    var isDrawing = false;
    var myTurn = true;
    window.mobilecheck = function() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    };

    var isMobile = window.mobilecheck();
    console.log(isMobile);    


    function drawCue(hash){
      var cue = hash.split("@");
      
      var def = ctx.lineWidth;
      ctx.lineWidth = 2;

      for(var c = 0; c < 20; c++)
      {
        var str = cue[c].split(';');
        ctx.beginPath();
        ctx.moveTo(str[0], c);
        for(var i = 0; i<str.length-1;i++)
        {
          ctx.lineTo(str[i], c);
          ctx.moveTo(str[i+1]-1, c);
        }
        ctx.stroke();
      }
      ctx.lineWidth = def;
    }

    function reset() {
        setBrush();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, 600, 440);
        if(savedHash)
          drawCue(savedHash);
    }
    function setBrush(){
      ctx.strokeStyle = 'black';
      brush.style.color = 'white';
      brush.style.background = 'black';

      eraser.removeAttribute('style');
    }
    function setErase(){
      ctx.strokeStyle = 'white';
      eraser.style.color = 'white';
      eraser.style.background = 'black';


      brush.removeAttribute('style');
    }

    brush.addEventListener('click', function(event) {
      setBrush();
    });
    eraser.addEventListener('click', function(event) {
      setErase();
    });



    reset();

   
    // Handle Brushes
    var brushes = document.getElementsByClassName('brushes')[0];
    
    
    if(!isMobile){
      tolon.remove();
      namon.remove();
    mobguard.remove();
    brushes.addEventListener('click', function(event) {
      ctx.lineWidth = event.target.value || 5;
    });
    // start stroke
    canvas.addEventListener('mousedown', function(event) {
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      imgarray.push(imgData);
      //console.log(imgarray.length);
      setMouseCoordinates(event);
      isDrawing = true;
      // Start Drawing
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
    });
    // move
    boudi.addEventListener('mousemove', function(event) {
      setMouseCoordinates(event);
      //console.log(mouseX,mouseY);
      if(mouseX>600 || mouseY>440 || mouseX<0 || mouseY<0)
        isDrawing=false;
    });
    
    canvas.addEventListener('mousemove', function(event) {
      setMouseCoordinates(event);
      if(isDrawing){
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    });
    // end stroke
    canvas.addEventListener('mouseup', function(event) {
      setMouseCoordinates(event);
      isDrawing = false;
    });
    }

    if(isMobile){
    brushes.addEventListener('touchend', function(event) {
      ctx.lineWidth = event.target.value || 5;
    });
    canvas.addEventListener('touchstart', function(event) {
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      imgarray.push(imgData);
      //console.log(imgarray.length);
      setTouchCoordinates(event);
      isDrawing = true;
      // Start Drawing
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
    });
    // move
    boudi.addEventListener('touchmove', function(event) {
      setTouchCoordinates(event);
      console.log(mouseX,mouseY);
      if(mouseX>600 || mouseY>440 || mouseX<0 || mouseY<0)
        isDrawing=false;
    });
    
    canvas.addEventListener('touchmove', function(event) {
      setTouchCoordinates(event);
      if(isDrawing){
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    });
    // end stroke
    canvas.addEventListener('touchend', function(event) {
      setTouchCoordinates(event);
      isDrawing = false;
    });
    }

    function setTouchCoordinates(event) {
      var boundings = canvas.getBoundingClientRect();
      mouseX = event.touches[0].clientX - boundings.left;
      mouseY = event.touches[0].clientY - boundings.top;
    }
    //mouse er scam
    function setMouseCoordinates(event) {
      var boundings = canvas.getBoundingClientRect();
      mouseX = event.clientX - boundings.left;
      mouseY = event.clientY - boundings.top;
    }



    //clear the shite
    clearButton.addEventListener('click', function(){
        reset();
    });
    undoButton.addEventListener('click', function(){
          ctx.putImageData(imgarray.pop(), 0, 0);
    });
    

    genButton.addEventListener('click', function(){
      if(myTurn)
      {
        var canvasDataURL = canvas.toDataURL();
        var cue = [];
        for(var c=420;c<440;c++)
        {
          var str = "";
          var imgData = ctx.getImageData(0, c, 600, 1);
          var i;
          for (i = 0; i < imgData.data.length; i += 4) {
            if(imgData.data[i] == 0)
              str = str + (i/4) + ";"
            //imgData.data[i+1] = 0
            //imgData.data[i+2] = 0
          }
          cue.push(str);
        }
        socket.emit('cue', cue.join("@"),roomID,socket.id,canvasDataURL);
      }
      myTurn = false;
    });

    saviorvi.addEventListener('click', function(){
      var canvasDataURL = canvas.toDataURL();
      socket.emit('cue', ';',roomID,socket.id,canvasDataURL);
      socket.emit('sesh', roomID);
    });


    function loadImage(url) {
      return new  Promise(resolve => {
          const image = new Image();
          image.addEventListener('load', () => {
              resolve(image);
          });
          image.src = url; 
      });
    }

    function loadImage(url,i) {
      return new  Promise(resolve => {
          const image = new Image();
          image.addEventListener('load', () => {
              resolve({'chobi' : image, 'index' : i});
          });
          image.src = url; 
      });
    }
    
    
    socket.on('sesh',function(rID,images){
      if(roomID == rID)
      {
        boudi.style.overflowY = 'scroll';
        picasso.style.zIndex = 3; 
        document.getElementById("final").height = 420*images.length;
        
        for(var i=0;i<images.length;i++)
        {
          loadImage(images[i],i)
              .then(out=>{
                
                kesto.drawImage(out['chobi'], 0, 420*out['index']); 
                if(out['index']==images.length-1)
                {
                  var canvasDataURL = document.getElementById("final").toDataURL();
                  var a = document.createElement('a');
                  a.href = canvasDataURL;
                  a.download = 'drawing' + roomID;
                  a.click();
                }
          });
        }

        // var canvasDataURL = document.getElementById("final").toDataURL();
        // var a = document.createElement('a');
        // a.href = canvasDataURL;
        // a.download = 'drawing' + roomID;
        // a.click();
      }
      
    });

    socket.on('cue',function(hash,rID,sID){
      //console.log("amio peyechi");
      if(roomID == rID)
      {
        if(sID==socket.id)
        {
          pauseBanner.style.opacity = 1;
          pauseBanner.style.zIndex = 1;
        }
        else
        {
          pauseBanner.style.opacity = 0;
          pauseBanner.style.zIndex = -1;
          savedHash = hash;
          reset();
          imgarray = [];
          var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          imgarray.push(imgData);
          myTurn = true;
        }
      }
    });

    makeroom.addEventListener('click', function(){
      if(roombox.value)
      socket.emit('joinroom', roombox.value, socket.id);
    });

    socket.on('roomfull', function(id){
      if(id == socket.id)
        alert("room full");
    });

    socket.on('roomsuccess', function(rID,id,flag){
      if(id == socket.id)
      { 
        roomID = rID;
        roominterface.style.opacity = 0;
        roominterface.style.zIndex = -1;
        if(flag)
        {
          pauseBanner.style.opacity = 0;
          pauseBanner.style.zIndex = -1;
        }
        else
        {
          pauseBanner.style.opacity = 1;
          pauseBanner.style.zIndex = 1;
        }
      }
    });

    socket.on('strength', function(rID,num){
      if(rID == roomID)
        document.getElementById("kkr").innerHTML = num;
    });
    
};
  