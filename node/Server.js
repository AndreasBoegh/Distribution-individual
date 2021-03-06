var cluster = require('cluster');
var sticky = require('sticky-session');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 8000;
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'redis', port: 6379 }));

//Sticky.listen returns false if master, and true if worker
//sticky.listen is responsible for starting workers,
//starts as many as there are CPU cores
//Only one instance on port 8000 runs, and sends users to different machines based on IP address
if (!sticky.listen(http, 8000)) {
	http.once('listening', function() {
		console.log('server started on port ' + port);
	});
} else {
	//calls function when a new connection is established
app.get('/', function(req, res){
  //sends the index.html file to the client
  console.log("Server accessed")
  res.sendFile(__dirname + '/index.html');
});

app.get('/test', function(req, res) {
	k = 0
	for (i = 0; i < 100000; i++) {
  	k += k + i;
	}
	//console.log("id: " + cluster.worker.id);
	res.send({worker id: cluster.worker.id})
});

// Total hack. Can't call the file without exposing it.
app.get('/draw.js', function(req, res){
	res.sendFile(__dirname + '/draw.js');
});

app.get('/style.css', function(req, res){
	res.sendFile(__dirname + '/style.css');
});

function onConnection(socket){
	socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
	socket.on('clear', () => socket.broadcast.emit('clear'));
}

io.on('connection', onConnection);

//http.listen(port, () => console.log('listening on port ' + port));
//http.listen(port, function () {
//  console.log('Server listening at port %d', port);
//});

}













