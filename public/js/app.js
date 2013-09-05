(function (io, $) {
  
  var canvas = new fabric.Canvas('canvas');

  console.log($('#pencil'));

  $('#pencil').click(function () {
    canvas.isDrawingMode = !canvas.isDrawingMode; 
    if (this[0].hasClass('active')) {
      alert('yes');
      this[0].removeClass('active');
    } else {
      alert('no');
      this[0].addClass('active');
    }
  });

  canvas.on('path:created', function () {
    console.log(JSON.stringify(canvas));
  });

  var socket = io.connect('http://localhost:3000');
  socket.on('data', function (data) {
    console.log(data);
  });

  socket.on('error', function (reason){
    console.error('Unable to connect Socket.IO', reason);
  });

  socket.on('connect', function (){
    console.info('successfully established a working and authorized connection');
  });  
})(io, jQuery);

