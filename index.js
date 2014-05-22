'use strict';
var path = require('path');
var http = require('http');
var connect = require('connect');
var io = require('socket.io');

var connectionPort = 8111;
var clientdir = path.join(process.cwd(), 'static');
var app = connect().use(connect.static(clientdir));
var server = http.createServer(app);

var socket = io.listen(server);
socket.sockets.on('connection', function(socket) {
  var ip = socket.handshake.address.address;
  console.log('Socket connection. ' + ip);
  socket.on('disconnect', function(socket) {
    console.log('Socket disconnect. ' + ip);
  });
  socket.on('setName', function(data) {
    socket.emit('notification', {
      name: data.value
    });
  });
});

server.listen(connectionPort, function() {
  console.log('server started on localhost:' + connectionPort);
});