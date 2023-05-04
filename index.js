const express=require('express')
const http=require('http')
const path=require('path')
const Filter=require('bad-words')
const socketio=require('socket.io')
const {GenerateMessage}=require('./utils/messages.js')
const {GenerateLocationMessage}=require('./utils/messages.js')
const {addUser,getUser,getUsersInRoom,removeUser}=require('./utils/users')
const PORT = process.env.PORT || 8080 

const app=express()
const server=http.createServer(app)
const io=socketio(server)
// let count=0;
io.on('connection',(socket)=>{
console.log('new websocket connection')
 
socket.on('join',({username,room},callback)=>{


const {error,user}=addUser({id:socket.id,
    username:username,
    room:room,
})

if(error){
return callback(error)
}

socket.join(user.room) //we are using the version we made in add function as we trimmed 



socket.emit('message',GenerateMessage('Admin','welcome!'))
// socket.broadcast.emit('message',GenerateMessage('A new user has joined the room'))
socket.broadcast.to(user.room).emit('message',GenerateMessage('Admin',user.username+' has joined the room'))
io.to(user.room).emit('roomData',{
    room:user.room,
    users:getUsersInRoom(user.room)
})

callback()
})
socket.on('sendmessage',(message,callback)=>{
    const userinfo=getUser(socket.id)
    const userRoom=userinfo.room
    const filter=new Filter()
    if(filter.isProfane(message)){  //this code is going to run if msg is profane
    return callback('profainity is not allowed')
    }
    io.to(userRoom).emit('message',GenerateMessage(userinfo.username,message))
    callback()
    // callback('Delivered!')
})
socket.on('disconnect',()=>{
   const user= removeUser(socket.id)
   if(user){
    io.to(user.room).emit('message',GenerateMessage('Admin',user.username+' has been disconnected'))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })
   }
})

socket.on('SendLocation',(coords,callback)=>{
    const userinfo=getUser(socket.id)
    const userRoom=userinfo.room
    const latitude=coords.latitude;
    const longitude=coords.longitude;
    io.to(userRoom).emit('LocationMessage',GenerateLocationMessage(userinfo.username,'https://google.com/maps?q='+latitude+','+longitude))
    callback()
})
})

const publicDirectoryPath=path.join(__dirname,'./public')
app.use(express.static(publicDirectoryPath))

server.listen(PORT,()=>{
    console.log(`server is up on port${PORT}`)
})