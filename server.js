const WebSocket = require('ws');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://modcgrupo6:modc2023@cluster0.tn70ola.mongodb.net/?retryWrites=true&w=majority";
const clientDb = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const db = clientDb.db("MODC");

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

console.log("Server is Running")

wss.on('connection', function connection(ws) {
  console.log('A new client has connected.');
  clients.add(ws);  

  ws.on('message', function incoming(message) {
    console.log(`Client sent message: ${message}`);
  
    // check the type of message received
  // function checkType(message) {
  //   const { type } = JSON.parse(message).type;
  // }
    
    // if (checkType(message) == "message") {  
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
      }
  // } else {
  //   const {type, name, email, phoneNumber, password } = JSON.parse(message);
  //   insertUser(name, email, phoneNumber, password);
  // }
  });

  // ws.on('user', function incomingUser(user) {
  //   console.log(`User created: ${user}`);
  //   //Registar na base de dados
  //   const { name, email, phoneNumber, password } = JSON.parse(user);
  //   insertUser(name, email, phoneNumber, password);
  // });
  

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


// async function insertUser(name, email, phoneNumber, password) {
//   try {
//     await clientDb.connect();
//     console.log("Database succesfully connected")
//     const messages = db.collection("users");
//     const result = await messages.insertOne({name: name, email: email, phoneNumber: phoneNumber, password: password})
//     console.log("User added to the db")
//   } finally {
//     await clientDb.close();
//   }
// }

//insertMessage();
// console.log("Server was killed")