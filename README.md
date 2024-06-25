# Melody generator

## Description
This web application was created as part of ICT Media & Design's third semester passion project deliverable. The app is intended as an inspiration tool to musicians or people who do music as a hobby. It allows users to generate melodies, visualize them, and export them as MIDI files.

## Features
- Generate a melody by randomizing aspects like pitch, note lengths and melody length.
- Visualize the melody on a piano roll or music score.
- Replay the last generated melody.
- Export the last generated melody as a MIDI file.
- Specify the scale of the generated melody (major or minor).
- Specify the instrument or synthesizer that will be used to play the melody.
- Change the color of the notes on the piano roll.

## Technology stack
- HTML, CSS, Javascript
- [Tone.js](https://tonejs.github.io/) - API for generating sound in the browser
- [Tonal.js](https://github.com/tonaljs/tonal?tab=readme-ov-file) - music theory library
- [midi-writer-js](https://www.npmjs.com/package/midi-writer-js) - API for writing a MIDI file
- Vite
- Express

## Setup and Installation
### Prerequisites
Make sure you have Node.js installed on your machine. You can check if you have it by executing the following command in the terminal.
```
node -v
```
You should see your version of Node (e.g. v20.12.1). If not, you can install it from [here](https://nodejs.org/en).

### Development Setup
1. Clone the repository
```
git clone https://git.fhict.nl/I522259/passion-project
cd passion-project
```
2. Install dependencies
```
npm install
```
3. Run the start script
```
npm start
```