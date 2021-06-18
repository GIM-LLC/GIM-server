const ROOM_THRESHOLD = 3;

// track current room, and number of connected users in the current room
let roomNumber = 0;
let currentUsers = 0;

//step to the next room, and set current users back to 0
const incrementRoom = () => {
  roomNumber++;
  currentUsers = 0;
};

//called whenever there is a new socket connection
const addUser = (socket, userObj, gamesArr) => {
  //keep an ongoing record of how many users are in a given room, and each user globally
  currentUsers += 1;
  userObj[socket.id] = socket;
  
  //does the current room have an ongoing game? if so join the next room
  if (gamesArr.includes(String(roomNumber))) {
    incrementRoom();
    userObj[socket.id].room = String(roomNumber);
  // if there is no ongoing game, but we have exceeded the max room size join the next room
  } else if (currentUsers >= ROOM_THRESHOLD) {
    incrementRoom();
    userObj[socket.id].room = String(roomNumber);
  // if there's no ongoing game, and enough spaces in the room join this current room
  } else {
    userObj[socket.id].room = String(roomNumber);
  }
};

// called once a user disconnects, remove their tracked socket and decrement current users in the room
const deleteUser = (socket, userObj) => {
  if(currentUsers > 0) currentUsers--;
  delete userObj[socket.id];
};

module.exports = { addUser, deleteUser };
