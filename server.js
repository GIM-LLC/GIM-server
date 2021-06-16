const { Server } = require('socket.io');
const http = require('http');

const app = require('./lib/app');
const server = http.createServer(app);
const io = new Server(server, { cors: true });

const PORT = process.env.PORT || 8080;

const users = {};
const games = [];

const { addUser, deleteUser } = require('./lib/socket/user-utils');

const onConnection = (socket) => {
  // GAME MECHANICS
  // on every connection, add a user a join that user's socket to the current room
  addUser(socket, users, games);
  const currentRoom = `${users[socket.id].room}`;
  socket.join(currentRoom);
  socket.broadcast.to(currentRoom).emit('new user', { [socket.id]: socket.id });
  // socket.to(socket.id).emit('current users', Object.keys(users));
  // take in cursor movement data and broadcast to other clients
  const onMovement = (movementData) => {
    movementData.id = socket.id;
    socket.broadcast.to(currentRoom).emit('moving', movementData);
  };
  const onGameStart = () => {
    if (!games.includes(currentRoom)) games.push(currentRoom);
  };
  // broadcast a remove cursor signal to other clients when a client disconnects, delete the user
  const onDisconnect = () => {
    deleteUser(socket, users);
    socket.broadcast.to(currentRoom).emit('removeCursor', socket.id);
  };
  // take in chat message data and emit to all clients
  const onMessage = (message) => {
    socket.to(currentRoom).emit('socket message', message);
  };

  ////////////////////////////////

  // SEARCH + HEADER MECHANICS
  // take in button state data and broadcast to other clients
  const onButtonClick = (buttonState) => {
    socket.broadcast.to(currentRoom).emit('socket search click', buttonState);
  };
  // take in input from search input field
  const onInputChange = (inputValue) => {
    socket.broadcast.to(currentRoom).emit('search input typing', inputValue);
  };
  //when 'duck' is entered into search bar duck data === TRUE
  const onDuckInput = (duckData) => {
    socket.to(currentRoom).emit('duck input', duckData);
  };
  // take in hover data from nav links (for now)
  const onHover = (hoverData) => {
    socket.to(currentRoom).emit('socket link hover', hoverData);
  };
  //take in user click on header to all users
  const onHeaderClick = (clickCount) => {
    socket.to(currentRoom).emit('socketHeaderTextClick', clickCount);
  };
  // When one user is hovering over Join Us, a second user clicks on "DONT" to change text to "I SAID DONT"
  const onDontClick = () => {
    socket.to(currentRoom).emit('SocketDontClick');
  };

  ////////////////////////////////

  // MAIN BODY MECHANICS
  // mission section hover
  const onMissionHover = (hover) => {
    socket.to(currentRoom).emit('socket mission hover', hover);
  };
  // presentational event that indicates the ghost story has been flipped over by a client and should be flipped for the other clients
  const onGhostStoryFlip = () => {
    socket.to(currentRoom).emit('ghostStoryFlip');
  };
  const onGhostStoryPoint = (points) => {
    socket.broadcast.to(currentRoom).emit('socketGhostStoryPoint', points);
  };
  //take in image gallery button data and emit to all clients
  const onImageButtonTextChange = (imageButtonData) => {
    socket.broadcast
      .to(currentRoom)
      .emit('button text change', imageButtonData);
  };
  const onImageHover = (imageHoverData) => {
    socket.broadcast.to(currentRoom).emit('image hover', imageHoverData);
  };
  const onGlowingObjectClick = (glowingObjectData) => {
    socket.broadcast
      .to(currentRoom)
      .emit('socket glowing object', glowingObjectData);
  };
  //click and points broadcast from ghost image
  const onGhostClick = (newPosition) => {
    socket.to(currentRoom).emit('socket ghost click', newPosition);
  };
  const onGhostPoints = () => {
    socket.to(currentRoom).emit('socket ghost points');
  };

  ////////////////////////////////

  // FOOTER MECHANICS
  // transparent footer click
  const onTransparentClick = () => {
    socket.to(currentRoom).emit('socket transparent click');
  };
  // transparent footer click points
  const onTransparentPoints = () => {
    socket.to(currentRoom).emit('socket transparent points');
  };
  // take in ghost icon data and emit to all clients
  const onSocialIconChange = (iconData) => {
    socket.to(currentRoom).emit('icon change', iconData);
  };
  //take in user click on footer to all users
  const onFooterTitleClick = (titleData) => {
    socket.to(currentRoom).emit('socketFooterTitleClick', titleData);
  };

  // attach functions to listeners
  // GAME + CHAT MECHANICS
  socket.on('movement', onMovement);
  socket.on('game start', onGameStart);
  socket.on('disconnect', onDisconnect);
  socket.on('client message', onMessage);

  // SEARCH + HEADER MECHANICS
  socket.on('searchSubmit', onButtonClick);
  socket.on('search input', onInputChange);
  socket.on('duck', onDuckInput);
  socket.on('link hover', onHover);
  socket.on('headerTextClick', onHeaderClick);
  socket.on('ClientDontClick', onDontClick);

  // MAIN BODY MECHANICS
  socket.on('missionHover', onMissionHover);
  socket.on('ghostStoryFlip', onGhostStoryFlip);
  socket.on('ghostStoryPoint', onGhostStoryPoint);
  socket.on('button text change', onImageButtonTextChange);
  socket.on('image hover', onImageHover);
  socket.on('ghost click', onGhostClick);
  socket.on('ghost points', onGhostPoints);
  socket.on('glowing object click', onGlowingObjectClick);

  // FOOTER MECHANICS
  socket.on('transparent click', onTransparentClick);
  socket.on('transparent points', onTransparentPoints);
  socket.on('icon change', onSocialIconChange);
  socket.on('footerTitleClick', onFooterTitleClick);
};

io.sockets.on('connection', onConnection);

server.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});
