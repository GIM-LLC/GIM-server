const ROOM_THRESHOLD = 3;

let roomNumber = 0;
let unassignedUsers = 0;

const addUser = (socket, userObj) => {
  console.log(`new user in room ${roomNumber}: ${socket.id}`);
  unassignedUsers += 1;
  userObj[socket.id] = socket;
  userObj[socket.id].room = String(roomNumber);
  
  if(unassignedUsers >= ROOM_THRESHOLD) {
    roomNumber ++;
    unassignedUsers = 0;
  }
};
  
const deleteUser = (socket, userObj) => {
  console.log('user left: ', socket.id);
  delete userObj[socket.id];
};

module.exports = { addUser, deleteUser };
