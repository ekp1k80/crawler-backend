import http from 'http'
import webSocket from 'ws'

// Crear un servidor HTTP
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server running');
});

// Crear un servidor WebSocket
const wss = new webSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Escuchar mensajes del cliente
    ws.on('message', (message) => {
      try {
        const messageStr = message.toString()
        const json = JSON.parse(messageStr)
        const currentdate = new Date(); 
        const datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/" 
            + currentdate.getFullYear() + " @ "  
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();

        if(json.type === 'broadcast'){
          console.log(`${datetime} -> Received message: ${message}`);
          wss.clients.forEach(function each(client) {
            if (client.readyState === webSocket.OPEN) {
              client.send(JSON.stringify(json.data));
            }
          });
        }
      } catch (e) {
        console.error(e)
      }
      
    });
});

// Iniciar el servidor HTTP (y WebSocket) en el puerto 8080
server.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
