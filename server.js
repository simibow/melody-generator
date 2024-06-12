const express = require('express'); // Importing the Express framework,
const path = require('path'); //  Importing Node.js' built-in path module to handle and transform file paths

const app = express(); // initializes an Express application and assigns it to the app variable
const PORT = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000


app.use(express.static(path.join(__dirname))); // create an absolute path to where server.js is located and serves all static files from there
                                               // in order to use images, stylesheets, etc directly

app.get('/', (req, res) => { // sets up a route to handle GET requests to the root URL
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => { // starts the server and makes it listen for connections on the specified port
  console.log(`Server is running on http://localhost:${PORT}`);
});
