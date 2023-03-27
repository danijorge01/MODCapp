// Get references to DOM elements
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const conversations = document.querySelector('#conversations');
const userForm = document.querySelector('#user-form');
const loginForm = document.querySelector('#login-input');
const nameUser = document.querySelector('#nameUser');
const emailUser = document.querySelector('#emailUser');
const phoneNumber = document.querySelector('#phone-number');
const passwordUser= document.querySelector('#passwordUser');

// Connect to the server using web sockets
const socket = new WebSocket('ws://localhost:8080');

// Handle messages received from the server
socket.addEventListener('message', async event => {
  console.log("Message received from server")
  //const messageText = await event.data.text();
  try {
    const messageText = await event.data;
    const message = JSON.parse(messageText);

    // check the type of message received
    function checkType(message) {
      const { type } = JSON.parse(message);
      return type;
    }
    if(checkType(message) == "login") {
      if(message.error) {
        alert(message.error);
      } else {
        const username = JSON.parse(message);
        localStorage.setItem("username", JSON.stringify(username.name));
        window.location.href = "app.html";
      }
    }
  } catch {
    const messageText = await event.data.text();
    const message = JSON.parse(messageText);
    displayMessage(message, message.sender);
  }
  
});

// Send a message to the server
function sendMessage(text) {
  const message = {type: 'message', text, sender: localStorage.getItem("username"), receiver: "joao"};
  socket.send(JSON.stringify(message));
  displayMyMessage(message, "me");
}

// Send user to the server
function sendUser(nameUser, emailUser, phoneNumber, passwordUser) {
  const user = {type: 'user', nameUser, emailUser, phoneNumber, passwordUser };
  socket.send(JSON.stringify(user));
  console.log("User sent to server");
}

// Send user to the server
function sendLoginInfo(phoneNumberInput, passwordInput) {
  const userInfo = {type: 'login', phoneNumberInput, passwordInput };
  socket.send(JSON.stringify(userInfo));
  console.log("Login info sent to server");
}

// Display a message in the conversation
function displayMessage(message, sender) {
  const chatBubble = document.createElement("div");
  chatBubble.classList.add("chat-bubble", "received");
  chatBubble.textContent = sender + ": " + message.text;
  conversations.appendChild(chatBubble);
}

// Display my message in the conversation
function displayMyMessage(message, sender) {
  const chatBubble = document.createElement("div");
  chatBubble.classList.add("chat-bubble", "sent");
  // chatBubble.classList.add('messageme');
  chatBubble.textContent = sender + ": " + message.text;
  conversations.appendChild(chatBubble);
}

