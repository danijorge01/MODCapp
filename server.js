const WebSocket = require('ws');

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

// console.log("Server was killed")