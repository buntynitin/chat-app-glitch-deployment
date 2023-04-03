const socketAction = (io, next) =>{
    io.on('connection', function(socket) {
        socket.on('join_room',(data) =>{
            socket.join(data.room_id)
            console.log(data.room_id, "Joined")
        })

        socket.on('sendMessage', (data) => {
            const room_id =  data.receiver_id
            socket.to(room_id).emit('receiveMessage', data) 
        });

        socket.on('disconnect', function () {
           console.log('A user disconnected');
        });
     });
     next();
}
module.exports = socketAction