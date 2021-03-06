const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

const { addUser } = require('../lib/socket/user-utils.js');

const testUsers = {};
const testGames = [];
jest.setTimeout(15000);
describe('user room functionality', () => {
  let io,
    clientSocket,
    clientSocket2,
    clientSocket3,
    clientSocket4,
    httpServer;

  beforeAll(async () => {
    httpServer = await createServer();
  });
  beforeAll((done) => {
    
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      clientSocket2 = new Client(`http://localhost:${port}`);
      clientSocket3 = new Client(`http://localhost:${port}`);
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

  afterAll(async () => {
    await io.close();
    await clientSocket.close();
    await clientSocket2.close();
    await clientSocket3.close();
    await clientSocket4.close();
    await httpServer.close();
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 10000)); // avoid jest open handle error
  });

  test('first client should be in room 0', (finish) => {
    const usersArr = Object.values(testUsers);
    expect(usersArr[1].room).toBe('0');
    finish();
  });

  test('final client should be in room 1', (finish) => {
    const usersArr = Object.values(testUsers);
    expect(usersArr[3].room).toBe('1');
    finish();
  });

});
