const { Server } = require('socket.io');
const http = require('http');

const app = require('./lib/app');
const server = http.createServer(app);
const io = new Server(server, { cors: true });

const PORT = process.env.PORT || 7890;

const { users, addUser, deleteUser } = require('./lib/socket/user-utils');

const onConnection = socket => {
  addUser(socket);
  socket.join(`${users[socket.id].room}`);

  socket.on('movement', data => {
    data.id = socket.id;
    socket.broadcast.to(`${users[socket.id]}.room`).emit('moving', data);
  });

  socket.on('disconnect', () => {
    socket.broadcast.to(`${users[socket.id].room}`).emit('removeCursor', socket.id);
    deleteUser(socket);
  });

  socket.on('click', buttonState => {
    socket.broadcast.to(`${users[socket.id].room}`).emit('click', buttonState);
  });

  socket.on('client message', (message) => {
    socket.to(`${users[socket.id].room}`).emit('socket message', message);
  });
};

io.sockets.on('connection', onConnection);

server.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});
