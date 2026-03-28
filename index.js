const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 静态文件服务：加载根目录的 index.html
app.use(express.static('.'));

// 强制根路由返回当前目录的 index.html（确保优先级最高）
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Socket.io 连接逻辑
io.on('connection', (socket) => {
  console.log('用户已连接: ' + socket.id);

  // 监听客户端发送的消息
  socket.on('chat message', (msg) => {
    // 广播给所有连接的客户端
    io.emit('chat message', msg);
  });

  // 监听撤回消息
  socket.on('recall message', (msgId) => {
    io.emit('recalled', msgId);
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log('用户已断开: ' + socket.id);
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
});
