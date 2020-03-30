window.onload = function () {
  var imgarray = [];
  var savecount = 0;
    // Definitions
    var canvas = document.getElementById("halo");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 600, 400);
    var boundings = canvas.getBoundingClientRect();
  

    var brush = document.getElementById('brush');
    var eraser = document.getElementById('eraser');
    function setBrush(){
      ctx.strokeStyle = 'black';
      brush.style.color = 'white';
      brush.style.background = 'black';

      eraser.removeAttribute('style');
    };
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
    function reset() {
        setBrush();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, 600, 420);
        var def = ctx.lineWidth;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.setLineDash([5,6]);
        ctx.moveTo(0, 410);
        ctx.lineTo(600, 410);
        ctx.moveTo(0, 10);
        ctx.lineTo(600, 10);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = def;
    }

    reset();
    // Specifications
    var mouseX = 0;
    var mouseY = 0;
    ctx.strokeStyle = 'black'; // initial brush color
    ctx.lineWidth = 5; // initial brush width
    var isDrawing = false;
  
    // Handle Brushes
    var brushes = document.getElementsByClassName('brushes')[0];
  
    brushes.addEventListener('click', function(event) {
      ctx.lineWidth = event.target.value || 5;
    });
  
    // Mouse Down Event
    canvas.addEventListener('mousedown', function(event) {
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      imgarray.push(imgData);
      console.log(imgarray.length);
      setMouseCoordinates(event);
      isDrawing = true;
  
      // Start Drawing
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
    });
  
    // Mouse Move Event
    canvas.addEventListener('mousemove', function(event) {
      setMouseCoordinates(event);
  
      if(isDrawing){
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    });
  
    // Mouse Up Event
    canvas.addEventListener('mouseup', function(event) {
      setMouseCoordinates(event);
      isDrawing = false;
    });
  
    // Handle Mouse Coordinates
    function setMouseCoordinates(event) {
      mouseX = event.clientX - boundings.left;
      mouseY = event.clientY - boundings.top;
    }
  
    // Handle Clear Button
    var clearButton = document.getElementById('clear');
  
    clearButton.addEventListener('click', function(){
        reset();
    });

    // colors.addEventListener('click', function(event) {
    //   context.strokeStyle = event.target.value || 'black';
    // });
    // Handle Clear Button
    var undoButton = document.getElementById('undo');
  
    undoButton.addEventListener('click', function(){
       // if(imgarray.length != 0)
          ctx.putImageData(imgarray.pop(), 0, 0);
        //alert("hello");
    });
  
    // Handle Save Button
    var genButton = document.getElementById('gen');
    genButton.addEventListener('click', function(){
      var canvasDataURL = canvas.toDataURL();
      var a = document.createElement('a');
      a.href = canvasDataURL;
      a.download = 'drawing' + savecount++;
      a.click();

      var str = "";
      var imgData = ctx.getImageData(0, 410, 600, 1);
      var i;
      for (i = 0; i < imgData.data.length; i += 4) {
        if(imgData.data[i] == 0)
          str = str + (i/4) + ";"
        //imgData.data[i+1] = 0
        //imgData.data[i+2] = 0
      }
      var genCode = document.getElementById('gencode');
      genCode.value = str;
      genCode.select();
      genCode.setSelectionRange(0, 99999);
      document.execCommand("copy")
     // alert("done");
    });

    var drButton = document.getElementById('ent');
    drButton.addEventListener('click', function(){
      var drCode = document.getElementById('entcode');
      var str = drCode.value.split(";");
      reset();
      var def = ctx.lineWidth;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(str[0], 10);
      for(var i = 0; i<str.length-1;i++)
      {
        ctx.lineTo(str[i], 10);
        ctx.moveTo(str[i+1]-1, 10);
      }
      ctx.stroke();
      ctx.lineWidth = def;
     // alert(str[0]);
    });
  };
  