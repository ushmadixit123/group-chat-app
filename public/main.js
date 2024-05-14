const socket = io();

const clientsTotal = document.getElementById('total-clients');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

socket.on('total-clients',(data)=>{
    clientsTotal.innerHTML = `Total clients: ${data}`
});

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    sendMessage();
});

function sendMessage(){
    console.log(messageInput.value);
    if(messageInput.value != ""){
        const data = {
            name : nameInput.value,
            message : messageInput.value,
            date : new Date()
        }
        
        socket.emit('message',data);
        addMessageToUI(true, data)
        messageInput.value = '';
    }
    
    
}
socket.on('chat-message',(data)=>{
    console.log(data)
    addMessageToUI(false,data)
    messageInput.value = '';
})

function addMessageToUI(isOwnMessage,data){
    clearFeedbackMessage();
    const element = `<li class="${isOwnMessage? 'message-right':'message-left'}">
    <p class="message">
        ${data.message}
        <span>${data.name} ⚫ ${data.date}</span>
    </p>
</li>`

messageContainer.innerHTML += element;
scrollToBottom();
}

function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight);
}

messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback : `${nameInput.value} is typing a message`
    })
});

messageInput.addEventListener('keyup',(e)=>{
    socket.emit('feedback',{
        feedback : `${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback : ''
    })
})
socket.on('feedback',(data)=>{
    clearFeedbackMessage();
    const element = `<li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
</li>`
messageContainer.innerHTML += element;
})

function clearFeedbackMessage(){
    document.querySelectorAll('li.message-feedback').forEach(ele=>{
        ele.parentNode.removeChild(ele);
    })
}