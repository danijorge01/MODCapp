// Get references to DOM elements
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const conversations = document.querySelector('#conversations');

// Connect to the server using web sockets
const socket = new WebSocket('ws://localhost:8080');

// Handle messages received from the server
socket.addEventListener('message', async event => {
  const messageText = await event.data.text();
  const message = JSON.parse(messageText);  
  console.log(message);
  // console.log("aloooo")
  // console.log(message)
  displayMessage(message, message.sender);
});

// Send a message to the server
function sendMessage(text) {
  const message = { text , sender: "maria"};
  // console.log('ola');
  // console.log(message);
  socket.send(JSON.stringify(message));
  displayMyMessage(message, "me");
}

// Display a message in the conversation
function displayMessage(message, sender) {
  console.log('ola');
  const messageElement = document.createElement('div');
  console.log(message);
  messageElement.classList.add('messageother');
  messageElement.textContent = sender + ": " + message.text;
  conversations.appendChild(messageElement);
}

// Display my message in the conversation
function displayMyMessage(message, sender) {
  console.log('ola');
  //const messageElement1 = document.createElement('div');
  console.log(message);
  //messageElement1.classList.add('wrapmsgme');
  const messageElement = document.createElement('div');
  messageElement.classList.add('messageme');
  messageElement.textContent = sender + ": " + message.text;
  conversations.appendChild(messageElement);
}

// Handle form submission
messageForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (text) {
    sendMessage(text);
    messageInput.value = '';
  }
});
