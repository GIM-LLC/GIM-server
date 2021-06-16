const ROOM_THRESHOLD = 3;

let roomNumber = 0;
let currentUsers = 0;

const addUser = (socket, userObj, gamesArr) => {
  currentUsers += 1;
  userObj[socket.id] = socket;
  
  if (gamesArr.includes(String(roomNumber))) {
    roomNumber++;
    currentUsers = 0;
    userObj[socket.id].room = String(roomNumber);
  } else if (currentUsers >= ROOM_THRESHOLD) {
    roomNumber++;
    currentUsers = 0;
    userObj[socket.id].room = String(roomNumber);
  } else {
    userObj[socket.id].room = String(roomNumber);
  }
  console.log(`new user in room ${userObj[socket.id].room}: ${socket.id}`);
};

const deleteUser = (socket, userObj) => {
  if(currentUsers > 0) currentUsers--;
  console.log('user left: ', socket.id);

  delete userObj[socket.id];
};

module.exports = { addUser, deleteUser };
