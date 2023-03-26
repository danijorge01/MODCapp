// Get references to DOM elements
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const conversations = document.querySelector('#conversations');
const userForm = document.querySelector('#user-form');
const nameUser = document.querySelector('#nameUser');
const emailUser = document.querySelector('#emailUser');
const phoneNumber = document.querySelector('#phone-number');
const passwordUser= document.querySelector('#passwordUser');

// Connect to the server using web sockets
const socket = new WebSocket('ws://localhost:8080');

// Handle messages received from the server
socket.addEventListener('message', async event => {
  const messageText = await event.data.text();
  const message = JSON.parse(messageText);  
  displayMessage(message, message.sender);
});

// Send a message to the server
function sendMessage(text) {
  const message = {type: 'message', text , sender: "maria", receiver: "joao"};
  socket.send(JSON.stringify(message));
  displayMyMessage(message, "me");
}

// Send user to the server
function sendUser(nameUser, emailUser, phoneNumber, passwordUser) {
  const user = {type: 'user', nameUser, emailUser, phoneNumber, passwordUser };
  socket.send(JSON.stringify(user));
  console.log("User sent to server");
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

//Handle message form submission
// messageForm.addEventListener('submit', event => {
//   event.preventDefault();
//   const text = messageInput.value.trim();
//   if (text) {
//     sendMessage(text);
//     messageInput.value = ''; // Clear the input field
//   }
// });

// function handleMessageFormSubmission(event) {
//   event.preventDefault();
//   const text = messageInput.value.trim();
//   if (text) {
//     sendMessage(text);
//     messageInput.value = ''; // Clear the input field
//   }
// }
// messageForm.addEventListener('submit', handleMessageFormSubmission);

// Handle user form submission from HTML form
// userForm.addEventListener('submit', event => {
//   event.preventDefault();
//   const nome = nameUser.value.trim();
//   const mail = emailUser.value.trim();
//   const phone = phoneNumber.value.trim();
//   const pass = passwordUser.value.trim();

//   if (nome && mail && phone && pass) {
//     //sendMessage(text);
//     sendUser(nome, mail, phone, pass);
//     nome.value = '';
//     mail.value = '';
//     phone.value = '';
//     pass.value = '';
//   }
// });

//LOGIN PART

function login() {
  var phoneNumberInput = document.getElementById("phone-number").value;
  var passwordInput = document.getElementById("password").value;

  //Ir buscar a base de dados os valores!!!!!
  var phoneNumber = "123456789";
  var password = "123456789";

  if (phoneNumberInput === phoneNumber && passwordInput === password) {
    alert("Login successful!");
    window.location = "app.html";
  } else {
    alert("Invalid username or password.");
  }
}

