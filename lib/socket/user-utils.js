const ROOM_THRESHOLD = 3;

let roomNumber = 0;
let unassignedUsers = 0;

const addUser = (socket, userObj, gamesArr) => {
  unassignedUsers += 1;
  userObj[socket.id] = socket;

  console.log(String(roomNumber), gamesArr);
  if (!gamesArr.includes(String(roomNumber))) {
    userObj[socket.id].room = String(roomNumber);
    console.log(`new user in room ${roomNumber}: ${socket.id}`);
    if (unassignedUsers >= ROOM_THRESHOLD) {
      roomNumber++;
      unassignedUsers = 0;
    }
  } else {
    roomNumber++;
    unassignedUsers = 0;
    userObj[socket.id].room = String(roomNumber);
    console.log(`new user in room ${roomNumber}: ${socket.id}`);
  }
};

const deleteUser = (socket, userObj) => {
  console.log('user left: ', socket.id);
  delete userObj[socket.id];
};

module.exports = { addUser, deleteUser };
