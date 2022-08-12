const socket=io()
// socket.on('CountUpdated',(count)=>{
//     console.log('count has been updated',count)
// })
// document.querySelector('#increase').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })
//elements dom manipulation
const $messageForm=document.querySelector('#message')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')

const $locationbutton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')
//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#Location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})    //we will get the parsed query string as an object


const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}






socket.on('message',(msg)=>{
    console.log(msg);
    const html=Mustache.render(messageTemplate,{
        msg:msg.text,
        UserName:msg.username,
        createdAt:moment(msg.createdAt).format('h-mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('LocationMessage',(locationUrl)=>{
    const html=Mustache.render(locationMessageTemplate,{
        UserName:locationUrl.username,
        locationUrl:locationUrl.url,
        createdAt:moment(locationUrl.createdAt).format('h-mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
console.log(locationUrl);
autoscroll()
})


socket.on('roomData',(roomdata)=>{
    const html= Mustache.render(sidebarTemplate,{
           room:roomdata.room,
           users:roomdata.users
    })
    document.querySelector('#side-bar').innerHTML=html

})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
//disabling the button code
$messageFormButton.setAttribute('disabled','disabled')  //as soon as user sent one message we are disabling the button to avoid multiple clicks as soon as we recive an acknoledgement from server we enable it again



    // const message=document.querySelector('input').value;
    const message=e.target.elements.message.value
    socket.emit('sendmessage',message,(error)=>{  //this function callback is going to be called when the server recieved it
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
                console.log(error)
              }     else{
             console.log('message has been delivered')  
                                                  }  
                                                                    //this is for the acknolodgement when server recieved this event server will print this 
    })
})

document.querySelector('#send-location').addEventListener('click',()=>{
    //disabling the button as soon user send the location
    $locationbutton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('navigator is not supported for your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
console.log(position)

socket.emit('SendLocation',{latitude:position.coords.latitude,longitude:position.coords.longitude},()=>{ //acknolodgement this function will be called back when server recived the location
   //enabling the location button
   $locationbutton.removeAttribute('disabled')
    console.log('Location Delivered')
})

    })
})


socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }

})