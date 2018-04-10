const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.MessagePort || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/user');

var user = new Users();
app.use(express.static(publicPath));

io.on('connection', (socket) => {
   console.log('New user connected');

    socket.on('Join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        socket.join(params.room);
        user.removeUser(socket.id);
        user.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', user.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
       var users = user.getUser(socket.id);

       if(users && isRealString(message.text)) {
            io.to(users.room).emit('newMessage', generateMessage(users.name, message.text));
       }
       callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var users = user.getUser(socket.id);
        if (users) {
            io.to(users.room).emit('newLocationMessage', generateLocationMessage(users.name, `${coords.latitude}, ${coords.longitude}`));
        }

    });

    socket.on('disconnect', () => {
        var users = user.removeUser(socket.id);

        if (users) {
            io.to(users.room).emit('updateUserList', user.getUserList(users.room));
            io.to(users.room).emit('newMessage', generateMessage('Admin', `${users.name} has left.`));
        }
    });

});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});