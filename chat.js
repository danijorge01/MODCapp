// Get references to DOM elements
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const conversations = document.querySelector('#conversations');
const userForm = document.querySelector('#user-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const phoneNumberInput = document.querySelector('#phone-number');
const passwordInput = document.querySelector('#password');

// Connect to the server using web sockets
const socket = new WebSocket('ws://localhost:8080');

// Handle messages received from the server
socket.addEventListener('message', async event => {
  const messageText = await event.data.text();
  const message = JSON.parse(messageText);  
  displayMessage(message, message.sender);
});

// Send a message to the server
// function sendMessage(text) {
//   const message = {type: 'message', text , sender: "maria", receiver: "joao"};
//   socket.send(JSON.stringify(message));
//   displayMyMessage(message, "me");
// }

function sendMessage(text) {
  const message = {text, sender: "maria", receiver: "joao"};
  socket.send(JSON.stringify(message));
  displayMyMessage(message, "me");
}

// Send user to the server
// function sendUser(type, name, mail, phoneNumber, pass) {
//   const user = {type, name, mail, phoneNumber, pass };
//   socket.send(JSON.stringify(user));
//   console.log("User sent to server");
// }
function sendUser( name, mail, phoneNumber, pass) {
  const user = {name, mail, phoneNumber, pass };
  socket.send(JSON.stringify(user));
  console.log("User sent to server");
}

// Display a message in the conversation
function displayMessage(message, sender) {
  const chatBubble = document.createElement("div");
  chatBubble.classList.add("chat-bubble", "received");
  chatBubble.textContent = sender + ": " + message.text;
  conversations.appendChild(chatBubble);


  // console.log('ola');
  // const messageElement = document.createElement('div');
  // console.log(message);
  // messageElement.classList.add('messageother');
  // messageElement.textContent = sender + ": " + message.text;
  // conversations.appendChild(messageElement);
}

// Display my message in the conversation
function displayMyMessage(message, sender) {

  const chatBubble = document.createElement("div");
  chatBubble.classList.add("chat-bubble", "sent");
  // chatBubble.classList.add('messageme');
  chatBubble.textContent = sender + ": " + message.text;
  conversations.appendChild(chatBubble);



  // console.log('ola');
  // console.log(message);
  // const messageElement = document.createElement('div');
  // messageElement.classList.add('messageme');
  // messageElement.textContent = sender + ": " + message.text;
  // conversations.appendChild(messageElement);
}

//Handle message form submission
messageForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (text) {
    sendMessage(text);
    messageInput.value = ''; // Clear the input field
  }
});

//SIGN UP PART

// Handle user form submission from HTML form
// userForm.addEventListener('submit', event => {
//   event.preventDefault();
//   const name = nameInput.value.trim();
//   const mail = emailInput.value.trim();
//   const phoneNumber = phoneNumberInput.value.trim();
//   const pass = passwordInput.value.trim();

//   if (name && mail && phoneNumber && pass) {
//     //sendMessage(text);
//     sendUser("user", name, mail, phoneNumber, pass);
//     name.value = '';
//     mail.value = '';
//     phoneNumber.value = '';
//     pass.value = '';
//   }
// });

// Handle user form submission from the signup.html page




//LOGIN PART

// function login() {
//   var phoneNumberInput = document.getElementById("phone-number").value;
//   var passwordInput = document.getElementById("password").value;

//   Ir buscar a base de dados os valores!!!!!
//   var phoneNumber = "123456789";
//   var password = "123456789";

//   if (phoneNumberInput === phoneNumber && passwordInput === password) {
//     alert("Login successful!");
//     window.location = "app.html";
//   } else {
//     alert("Invalid username or password.");
//   }
//}

