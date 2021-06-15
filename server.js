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
  const currentRoom = `${users[socket.id].room}`;

  socket.join(currentRoom);

  socket.broadcast.to(currentRoom).emit('new user', { [socket.id]: socket.id });

  // socket.to(socket.id).emit('current users', Object.keys(users));

  // take in cursor movement data and broadcast to other clients
  const onMovement = movementData => {
    movementData.id = socket.id;
    socket.broadcast.to(currentRoom).emit('moving', movementData);
  };

  // take in button state data and broadcast to other clients
  const onButtonClick = buttonState => {
    socket.broadcast.to(currentRoom).emit('socket serach click', buttonState);
  };

  // take in input from search input field
  const onInputChange = inputValue => {
    socket.broadcast.to(currentRoom).emit('search input typing', inputValue);
  };

  // take in hover data from nav links (for now)
  const onHover = hoverData => {
    socket.to(currentRoom).emit('socket link hover', hoverData);
  };

  // take in message data and emit to all clients
  const onMessage = message => {
    socket.to(currentRoom).emit('socket message', message);
  };
  // take in ghost icon data and emit to all clients
  const onSocialIconChange = iconData => {
    socket.to(currentRoom).emit('icon change', iconData);
  };
  //take in user click on header to all users
  const onHeaderClick = (clickCount) => {
    socket.to(currentRoom).emit('socketHeaderTextClick', clickCount);
  };
  //take in image gallery button data and emit to all clients
  const onImageButtonTextChange = (imageButtonData) => {
    socket.broadcast.to(currentRoom).emit('button text change', imageButtonData);
  };
  const onImageHover = (imageHoverData) => {
    socket.broadcast.to(currentRoom).emit('image hover', imageHoverData);
  };
  // broadcast a remove cursor signal to other clients when a client disconnects, delete the user
  const onDisconnect = () => {
    deleteUser(socket, users);
    socket.broadcast.to(currentRoom).emit('removeCursor', socket.id);
  };

  // attach functions to listeners
  socket.on('movement', onMovement);
  socket.on('searchSubmit', onButtonClick);
  socket.on('search input', onInputChange);
  socket.on('link hover', onHover);
  socket.on('client message', onMessage);
  socket.on('icon change', onSocialIconChange);
  socket.on('headerTextClick', onHeaderClick);
  socket.on('button text change', onImageButtonTextChange);
  socket.on('image hover', onImageHover);
  socket.on('disconnect', onDisconnect);
};

io.sockets.on('connection', onConnection);

server.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});
