
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
