const users=[]
const addUser=({id,username,room})=>{
//clean the data
//every individual connection(soket) has different id
//we will get id and username from client side js using qs and parsing the query string
username=username.trim().toLowerCase();
room=room.trim().toLowerCase();

//validate the data
if(!username || !room){
    return {error:'username and room are required'}
}

//username must be unique in that room

const exsistinguser=users.find((user)=>{
return user.room===room && user.username===username
})

//Validate user name
if(exsistinguser){
    return {
        error:'username is in use'
    }
}
//now if data is valid we can store them

const user={id,username,room}
users.push(user)
return {user}

}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
          return user.id===id
    })

    if(index!==-1){
      return users.splice(index,1)[0]
    }
}


const getUser=(id)=>{
    const userinfo=users.find((user)=>{
    return user.id===id
    })
    if(!userinfo){
        return {
            error:'there is no user with that id in the room'
        }
    }
    return userinfo
    }
    
    
    const getUsersInRoom=(room)=>{
    const usersInRoom=users.filter((user)=>{
     return user.room===room
    })
    if(!usersInRoom){
        return []
    }
    return usersInRoom
    }




addUser({
    id:22,
    username:'Vishnu',
    room:'Nitw',
})
addUser({
    id:23,
    username:'vissu',
    room:'Nitw',
})
addUser({
    id:24,
    username:'Tej',
    room:'Nitw1',
})


module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
}

