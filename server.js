const { Server } = require('socket.io');
const http = require('http');

const app = require('./lib/app');
const server = http.createServer(app);
const io = new Server(server, { cors: true });

const PORT = process.env.PORT || 8080;

const users = {};
const { addUser, deleteUser } = require('./lib/socket/user-utils');

const onConnection = socket => {
  // on every connection, add a user a join that user's socket to the current room
  addUser(socket, users);
  socket.join(`${users[socket.id].room}`);

  // take in cursor movement data and broadcast to other clients
  const onMovement = movementData => {
    movementData.id = socket.id;
    socket.broadcast.to(`${users[socket.id].room}`).emit('moving', movementData);
  };

  // take in button state data and broadcast to other clients
  const onButtonClick = buttonState => {
    socket.broadcast.to(`${users[socket.id].room}`).emit('socket serach click', buttonState);
  };

  // take in input from search input field
  const onInputChange = inputValue => {
    socket.broadcast.to(`${users[socket.id].room}`).emit('search input typing', inputValue);
  };

  // take in message data and emit to all clients
  const onMessage = message => {
    socket.to(`${users[socket.id].room}`).emit('socket message', message);
  };

  // broadcast a remove cursor signal to other clients when a client disconnects, delete the user
  const onDisconnect = () => {
    socket.broadcast.to(`${users[socket.id].room}`).emit('removeCursor', socket.id);
    deleteUser(socket, users);
  };

  // attach functions to listeners
  socket.on('movement', onMovement);
  socket.on('searchSubmit', onButtonClick);
  socket.on('search input', onInputChange);
  socket.on('client message', onMessage);
  socket.on('disconnect', onDisconnect);
};

io.sockets.on('connection', onConnection);

server.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});
