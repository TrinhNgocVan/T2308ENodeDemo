const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Phục vụ file HTML tĩnh
app.use(express.static('public'));

let users = {}; // Lưu danh sách người dùng

io.on('connection', (socket) => {
  console.log('Người dùng kết nối:', socket.id);

  // Khi người dùng tham gia
  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('message', `${username} đã tham gia phòng chat.`);
    io.emit('onlineUsers', Object.values(users).length);
  });

  // Khi nhận được tin nhắn
  socket.on('chatMessage', (msg) => {
    const username = users[socket.id] || 'Ẩn danh';
    io.emit('message', `${username}: ${msg}`);
  });

  // Khi người dùng ngắt kết nối
  socket.on('disconnect', () => {
    const username = users[socket.id] || 'Người dùng';
    delete users[socket.id];
    io.emit('message', `${username} đã rời khỏi phòng.`);
    io.emit('onlineUsers', Object.values(users).length);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
