const express = require('express'); // Importing the Express framework,
const path = require('path'); //  Importing Node.js' built-in path module to handle and transform file paths
const app = express(); // initializes an Express application and assigns it to the app variable
const PORT = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

app.use(bodyParser.json()); // middleware to parse json bodies
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the Vite build
// app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname))); // create an absolute path to where server.js is located and serves all static files from there
                                               // in order to use images, stylesheets, etc directly

app.get('/', (req, res) => { // sets up a route to handle GET requests to the root URL
  res.sendFile(path.join(__dirname, 'index.html'));
});
// Serve the frontend files
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// Endpoint to handle saving the MIDI file
app.post('/save-midi', (req, res) => {
  console.log('Received request body:', req.body);
  let base64MidiData = req.body.midiData;

  // Decode the Base64 string
  let buffer = Buffer.from(base64MidiData, 'base64');

  // Write the buffer to a file
  // fs.writeFile('output.mid', buffer, (err) => {
  //     if (err) {
  //         console.error('Error saving the file:', err);
  //         res.status(500).json({ message: 'Failed to save MIDI file' });
  //         return;
  //     }
  //     console.log('The file has been saved as output.mid');

  //     res.status(200).json({ message: 'MIDI file saved successfully' });
  // });
  const filePath = path.join(__dirname, 'output.mid');
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error('Error saving the file:', err);
      return res.status(500).json({ message: 'Failed to save MIDI file' });
    }
    console.log('The file has been saved as output.mid');

    // Send the file back to the client
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending the file:', err);
        return res.status(500).json({ message: 'Failed to send MIDI file' });
      }
      // Optionally delete the file after sending
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting the file:', err);
        }
        console.log('Temporary file deleted');
      });
    });
  });
});

app.listen(PORT, () => { // starts the server and makes it listen for connections on the specified port
  console.log(`Server is running on http://localhost:${PORT}`);
});
