const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');


const PORT = 3000 || process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botname = "ChitChat";


app.use(express.static(path.join(__dirname, 'public')));
//username = req.cookies["username"];
io.on('connection', socket =>{
    socket.on('chatsess', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage(botname, 'Welcome to ChitChat!'));

        socket.broadcast.to(user.room).emit('message', formatMessage(botname, `${user.username} has joined the chat`)
        );

        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users: getRoomUsers(user.room)
        });


    });

    socket.on('chatMessage', msg =>
    {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });

    socket.on('disconnect', () => { 
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', 
            formatMessage(botname, `${user.username} has left the chat`)
            );


            io.to(user.room).emit('roomUsers',{
                room : user.room,
                users: getRoomUsers(user.room)
            });
        }

        
    });


    
});





server.listen(PORT,() => console.log(`Server running on port ${PORT}`));