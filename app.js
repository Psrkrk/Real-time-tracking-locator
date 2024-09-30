// Import required modules
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();

// Set up the HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIo(server);

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Handle Socket.IO connections
io.on('connection', (socket) => {
  socket.on("send-location", function(data){
io.emit("recieve-location", {id: socket.id, ...data})
  });
  console.log('connected'); // This should display in the terminal

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

// Set up a route to render the EJS view
app.get('/', (req, res) => {
  res.render('index'); // Make sure index.ejs is located in the 'views' folder
});

// Start the server and listen on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
