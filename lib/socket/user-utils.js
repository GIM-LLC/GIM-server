const ROOM_THRESHOLD = 3;

let roomNumber = 0;
let unassignedUsers = 0;

const addUser = (socket, userObj, gamesArr) => {
  unassignedUsers += 1;
  userObj[socket.id] = socket;
  userObj[socket.id].room = String(roomNumber);

  if (gamesArr.includes(String(roomNumber))) {
    roomNumber++;
    unassignedUsers = 0;
    userObj[socket.id].room = String(Number(userObj[socket.id].room) + 1);
  } else if (unassignedUsers >= ROOM_THRESHOLD) {
    roomNumber++;
    unassignedUsers = 0;
  }
  console.log(`new user in room ${userObj[socket.id].room}: ${socket.id}`);
};

const deleteUser = (socket, userObj) => {
  if(unassignedUsers > 0) unassignedUsers--;
  console.log('user left: ', socket.id);
  delete userObj[socket.id];
};

module.exports = { addUser, deleteUser };
