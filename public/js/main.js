const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const urlpath = document.baseURI.slice(document.baseURI.indexOf("/chat/")).replace("/chat/","")
const username = document.getElementById('users').innerHTML; 
const room = document.getElementById('naam').innerHTML; 
console.log("-------------->",username, room);

const socket = io();

socket.emit('chatsess', {username, room});
socket.on('roomUsers', ({room, users})=>{
  outputUsers(users);
});



socket.on('message', message => {
  console.log(message)
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;

});

chatForm.addEventListener('submit', (e) =>{
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit('chatMessage',msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

});

function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username}<span> - ${message.time}</span></p>
  <p class = "text">
  ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}


function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}