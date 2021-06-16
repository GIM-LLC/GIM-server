const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

const { addUser } = require('../lib/socket/user-utils.js');

const testUsers = {};
const testGames = [];
jest.setTimeout(5000);
describe('user room functionality', () => {
  let io,
    clientSocket,
    clientSocket2,
    clientSocket3,
    clientSocket4;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      clientSocket2 = new Client(`http://localhost:${port}`);
      clientSocket3 = new Client(`http://localhost:${port}`);
      clientSocket4 = new Client(`http://localhost:${port}`);
      clientSocket4 = new Client(`http://localhost:${port}`);

      io.on('connection', (socket) => {
        addUser(socket, testUsers, testGames);
      });

      clientSocket.on('connect', done);
      clientSocket2.on('connect', done);
      clientSocket3.on('connect', done);
      clientSocket4.on('connect', done);

      return (() => {
        clientSocket.off('connect', done);
        clientSocket2.off('connect', done);
        clientSocket3.off('connect', done);
        clientSocket4.off('connect', done);
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
    clientSocket2.close();
    clientSocket3.close();
    clientSocket4.close();
  });

  test('first client should be in room 0', () => {
    const usersArr = Object.values(testUsers);
    expect(usersArr[1].room).toBe('0');
  });

  test('final client should be in room 1', () => {
    const usersArr = Object.values(testUsers);
    expect(usersArr[3].room).toBe('1');
  });

});
