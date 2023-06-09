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
      const username = JSON.parse(message);
      if(username.error) {
        alert(username.error);
      } else {
        sessionStorage.setItem("username", username.name);
        console.log(username);
        sessionStorage.setItem('sessionToken', username.token);
        sessionStorage.setItem('expiresAt', username.expiresAt);
        window.location.href = "app.html";
      }
    } if(checkType(message) == "usersInfo") {
      const users = JSON.parse(message);
      console.log(users);
    }
  } catch {
    const messageText = await event.data.text();
    const message = JSON.parse(messageText);
    displayMessage(message, message.sender);
  }
  
});

// Send a message to the server
function sendMessage(text) {
  const message = {type: 'message', text, sender: sessionStorage.getItem("username"), receiver: "joao"};
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

// Get all users
function sendGetAllUsers(name) {
  const usersReq = {type: 'usersInfo', name};
  console.log(usersReq);
  socket.send(JSON.stringify(usersReq));
  console.log("Request all users sent to server");
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

function logout() {
  // Remove the session token from the browser's storage
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('sessionToken');

  // Redirect the user to the login page or homepage
  window.location.href = 'login.html'; // Replace with the URL of your login page or homepage
}

