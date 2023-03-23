const WebSocket = require('ws');
const { MongoClient, ServerApiVersion } = require('mongodb');

//const mongoose = require('moongose');
//import mongoose from 'mongoose';

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

console.log("Server is Running")

wss.on('connection', function connection(ws) {
  console.log('A new client has connected.');
  clients.add(ws);

  ws.on('message', function incoming(message) {
    console.log(`Client sent message: ${message}`);

    // Send the message to all other clients
    for (let client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log(`Sending message to client`);
        // LINHA ABAIXO N ENVIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

        client.send(message);
        console.log(`Is it sending?: ${message}`);
      }
    }
  });

  ws.on('close', function close() {
    console.log('A client has disconnected.');
    clients.delete(ws);
  });
});

async function insertMessage() {
  const uri = "mongodb+srv://modcgrupo6:modc2023@cluster0.tn70ola.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  try {
    await client.connect();
    console.log("Database succesfully connected")
    const db = client.db("MODC");
    const messages = db.collection("messages");
    const result = await messages.insertOne({text: 'Hello, world!', sender: 'Alice', timestamp: new Date()})
    console.log("Message added to the db")
  } finally {
    await client.close();
  }
}

insertMessage();
// console.log("Server was killed")