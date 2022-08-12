const GenerateMessage=(username,text)=>{
return {
    text,
    username,
    createdAt:new Date().getTime()
}
}




const GenerateLocationMessage=(username,url)=>{
return {url:url,
    username:username,
createdAt:new Date().getTime()
}
}


module.exports={
    GenerateMessage,
    GenerateLocationMessage
}