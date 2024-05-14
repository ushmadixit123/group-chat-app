const express = require('express');
const path = require('path');
const { Socket } = require('socket.io');
const app = express();
const PORT = process.env.PORT || 3000;
// app.use(express.static(path.join(__dirname+'public')));
app.use(express.static('public'))

// app.get('/',(req, res)=>{
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// })

const server = app.listen(PORT,()=>{
    console.log(`Server on PORT ${PORT}`);
});
const socketsConnected = new Set();
const io = require('socket.io')(server);
io.on('connection',onConnected)
function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id);
    socket.emit('total-clients',socketsConnected.size);

    socket.on('disconnect',()=>{
        socketsConnected.delete(socket.id);
        socket.emit('total-clients',socketsConnected.size);
    })
    socket.on('message',(data)=>{
        console.log(data);
        socket.broadcast.emit('chat-message',data); 
    });
    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data);
    });
}
