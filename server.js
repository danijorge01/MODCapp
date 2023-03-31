const WebSocket = require('ws');
const crypto = require('crypto');
const Session = require('express-session').Session;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://modcgrupo6:modc2023@cluster0.tn70ola.mongodb.net/?retryWrites=true&w=majority";
const clientDb = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const db = clientDb.db("MODC");
const bcrypt = require('bcrypt');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

console.log("Server is Running")

wss.on('connection', function connection(ws) {
  console.log('A new client has connected.');
  clients.add(ws);  

  ws.on('message', async function incoming(message) {
    console.log(`Client sent message: ${message}`);
  
    // check the type of message received
    function checkType(message) {
      const { type } = JSON.parse(message);
      return type;
    }

    //console.log(checkType(message));
    if (checkType(message) == "message") {  
    // Send the message to all other clients
      for (let client of clients) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          console.log(`Sending message to client`);
          client.send(message);
          // get the message content and the user who sent it
          const { text, sender, receiver } = JSON.parse(message);
          timestamp = new Date();
          // Register the message in the database in json format
          insertMessage(text, sender, receiver, timestamp);
        }
      }}
    if (checkType(message) == "user") {
      const {nameUser, emailUser, phoneNumber, passwordUser } = JSON.parse(message);
      const passHash = await hashPass(passwordUser);
      const pass = passHash[0];
      const salt = passHash[1];
      // const result = await users.insertOne({name: name, email: email, phoneNumber: phoneNumber, password: res[0] + "«" + res[1]})
      insertUser(nameUser, emailUser, phoneNumber, pass + "«" + salt);
    }
    if (checkType(message) == "login") {
      const {phoneNumberInput, passwordInput } = JSON.parse(message);
      const res = await getUser(phoneNumberInput);
      if (res.error) {
        res.type = "login";
        const res2 = JSON.stringify(res);
        ws.send(JSON.stringify(res2));
      } else {
        const salt = res.password.split("«")[1];
        const pass = res.password.split("«")[0];
        const passHash = await bcrypt.hash(passwordInput, salt);
        
        if(passHash != pass) {
          res.type = "login";
          res.error = "Incorrect email or password.";
          const res2 = JSON.stringify(res);
        ws.send(JSON.stringify(res2));
        } else {
          res.type = "login";
          const sessionToken = generateToken(32);
          const expiresAt = Date.now() + 600000;
          res.token = sessionToken;
          res.expiresAt = expiresAt;
          const res2 = JSON.stringify(res);
          ws.send(JSON.stringify(res2));
        }
      }
    }
    if (checkType(message) == "usersInfo") {
      const {name} = JSON.parse(message);
      const res = await getAllUsers(name);
      res.type = "usersInfo";
      console.log(res);
      const res2 = JSON.stringify(res);
      ws.send(JSON.stringify(res2));
    }
  });

  ws.on('close', function close() {
    console.log('A client has disconnected.');
    clients.delete(ws);
  });
});

async function insertMessage(message, sender, receiver, timestamp) {

  try {
    await clientDb.connect();
    console.log("Database succesfully connected")
    const messages = db.collection("messages");
    const result = await messages.insertOne({messsage: message, sender: sender, receiver: receiver, timestamp: timestamp})
    console.log("Message added to the db")
  } finally {
    await clientDb.close();
  }
}


// insert a user in the database
async function insertUser(name, email, phoneNumber, password) {
  try {
    await clientDb.connect();
    console.log("Database succesfully connected")
    const users = db.collection("users");
    const result = await users.insertOne({name: name, email: email, phoneNumber: phoneNumber, password: password})
    console.log("User added to the db")
  } finally {
    await clientDb.close();
  }
}

async function getUser(phoneNumber) {
  try {
    await clientDb.connect();
    console.log("Database succesfully connected")
    const users = db.collection("users");
    const result = await users.findOne({phoneNumber: phoneNumber});
    if(!result) {
      return {error: "Incorrect email or password."};
    } else {
      return result;
    }
    
  } finally {
    await clientDb.close();
  }
}

async function getAllUsers(name) {
  try {
    await clientDb.connect();
    console.log("Database succesfully connected")
    const users = db.collection("users");
    const result = await users.find({name: {$ne: name}}).toArray();
    return result;    
  } finally {
    await clientDb.close();
  }
}

function generateToken(length) {
  // Define all possible characters that can be used in the token
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // Initialize an empty string to store the token
  let token = '';
  // Loop through the specified length and randomly select a character from the characters string to add to the token
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

// When a user signs up, hash their password and store it in the database
async function hashPass(password) {
  // Generate a salt to add to the password before hashing
  const salt = await bcrypt.genSalt(10);
  // Hash the password using the salt
  console.log(password);
  const hash = await bcrypt.hash(password, salt);
  const res = [];
  res.push(hash);
  res.push(salt);
  return res;
}