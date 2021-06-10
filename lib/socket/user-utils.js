const ROOM_THRESHOLD = 3;

const users = {};
let roomNumber = 0;
let unassignedUsers = 0;

const addUser = socket => {
  console.log(`new user in room ${roomNumber}: ${socket.id}`);
  unassignedUsers += 1;
  users[socket.id] = socket;
  users[socket.id].room = String(roomNumber);
  
  if(unassignedUsers >= ROOM_THRESHOLD) {
    roomNumber ++;
    unassignedUsers = 0;
  }
};
  
const deleteUser = socket => {
  console.log('user left: ', socket.id);
  delete users[socket.id];
};

module.exports = { users, addUser, deleteUser };
