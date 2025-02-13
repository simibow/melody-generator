import { Scale } from "tonal"; // imports the specified modules from the Tonal.js library, which is used to refer to music theory
import * as Tone from "tone"; // Tone.js is the API for playing the sounds
import MidiWriter from 'midi-writer-js';
import { log } from "tone/build/esm/core/util/Debug";

// define all the global variables

let savedMelodyComponents = {}; // the melody notes and the lengths of each note for the last played melody are stored here
let isToneStarted = false; // a flag to activate the Tone API only once
// define a list of note lengths to be used in the melody generation
let noteLengthsSelection = [ "8n", "4n", "8n", "8n", "8n", "8n", "8n"]; 
let noteLengths = [];
// let generatedMusicContainer = document.querySelector('section.generated-music'); // where the note progression will be displayed on the page
// let melodyNotesContainer = document.createElement('div');
// get a node list of the note containers
let allNoteLanes = document.querySelectorAll('.note-lane');
// get the scale toggle switch element
let scaleToggle = document.querySelector('#switch-scale');
// get the visualization toggle switch element
let visualizationToggle = document.querySelector('#switch-visualization');
console.log(visualizationToggle);
// make sure the checkboxes are unchecked on page reload
scaleToggle.checked = false;
visualizationToggle.checked = false;
// get the export button element
let exportBtn = document.querySelector('#export');
exportBtn.disabled = true;
// get the replay melody button
let replayBtn = document.querySelector('#replay');
replayBtn.disabled = true;
// get the generate new melody button
let generateBtn = document.querySelector('#generate');
// get the export message element 
let exportMsg = document.querySelector('.export-message');
// get the note color elements
let noteColorElements = document.querySelectorAll('.note-color-option');
// get the container for the music notes in the music score visualization
let musicScoreContainer = document.querySelector('.music-notes');
// get the container for the whole music score element
let musicScoreElement = document.querySelector('section.music-score-container');
// get the container for the piano roll element
let pianoRollElement = document.querySelector('section.piano-roll-container');
// get the key signature element
let keySignature = document.querySelector('.key-signature');
let noteTimelinePositionOnScore = 120; // this var will be used to calculate the left position of each note on the music score

function generateMelody(){
    // randomize melody length - number of notes - keep it short
    let minMelodyLength = 7;
    let maxMelodyLength = 15;
    let melodyLength = 0;
    melodyLength = Math.floor(Math.random() * (maxMelodyLength - minMelodyLength + 1)) + minMelodyLength;
    let notes = [];
    noteLengths = []; // reset the array
    // get the chosen type of scale and base the melody notes on it
    let scaleNotes; // define the container for the notes of the chosen scale
    if (scaleToggle.checked){
        scaleNotes = Scale.get("C minor").notes;
        console.log('minor scale chosen');
        noteTimelinePositionOnScore = 220; // add more space to account for the key signature
        keySignature.style.display = 'flex'; // show the key signatire for the key of C minor
    }
    else{
        scaleNotes = Scale.get("C major").notes;
        console.log('major scale chosen');
        noteTimelinePositionOnScore = 120;
        keySignature.style.display = 'none';
    }
    // reset the position of the notes in the music score
    console.log('is visualization toggle checked: ', visualizationToggle.checked);
    // if(visualizationToggle.checked){ // if the chosen scale is minor
    //     noteTimelinePositionOnScore = 180; // add more space to account for the key signature
    //     console.log('generating melody for a minor scale');
    // }
    // else{ // if the scale is major
    //     noteTimelinePositionOnScore = 120;
    //     console.log('generating melody for a major scale');
    // }
    // randomize pitch
    function getRandomScaleNote(){
        return Math.floor(Math.random() * scaleNotes.length); // returns random int from 0 to 6
    }
    function getRandomNoteLength(){
        return Math.floor(Math.random() * noteLengthsSelection.length); // returns a random int from 0 to 5
    }
    function createNoteProgression(){
        for (let i = 0; i < melodyLength; i++){
            notes.push(getRandomScaleNote())
        }
        return notes;
    }
    function createNoteLengthProgression(){
        for (let i = 0; i < melodyLength; i++){
            noteLengths.push(getRandomNoteLength())
        }
        //console.log('createNoteLengthProgression after for', noteLengths);
        noteLengths = noteLengths.map(item => noteLengthsSelection[item]);
        //console.log('createNoteLengthProgression after map', noteLengths);
        return noteLengths;
    }
    noteLengths = createNoteLengthProgression();
    //console.log('saved note lengths: ', noteLengths);
    notes = createNoteProgression();
    //console.log('random note progression: ', createNoteProgression());

    let mappedNotes = notes.map(item => scaleNotes[item]); // index refers to the item, not the index of it
    //console.log('mappedNotes is ', mappedNotes);

    // lets play the melody without randomizing note length and breaks
    // play the melody in the 4th octave
    // add a 4 to each item in the mappedNotes array
    mappedNotes = mappedNotes.map(note => note.concat('4'));
    console.log('mappedNotes is ', mappedNotes);
    savedMelodyComponents.melodyLine = mappedNotes;
    savedMelodyComponents.noteLengths = noteLengths;
    let melodyComponents = { melodyLine: mappedNotes, noteLengths: noteLengths };
    return melodyComponents;
}

// get the chosen melody visualization method

// change the visualization method based on the chosen option
visualizationToggle.addEventListener('change', function(){
    if(visualizationToggle.checked){ // music score chosen
        musicScoreElement.style.display = 'flex';
        pianoRollElement.style.display = 'none';
    }
    else{ // piano roll chosen
        musicScoreElement.style.display = 'none';
        pianoRollElement.style.display = 'flex';
    }
})


// select the instrument
// let instrumentElement = document.querySelector('#select-instrument');
let instrument;
let instrumentSound;
let instrumentsSelection = {
    'mono synth': new Tone.Synth().toDestination(),
    'fm synth': new Tone.FMSynth().toDestination(),
    'pluck synth': new Tone.PluckSynth().toDestination(),
    'piano': new Tone.Sampler({
        urls: {
            "A0": "A0.mp3",
            "C1": "C1.mp3",
            "D#1": "Ds1.mp3",
            "F#1": "Fs1.mp3",
            "A1": "A1.mp3",
            "C2": "C2.mp3",
            "D#2": "Ds2.mp3",
            "F#2": "Fs2.mp3",
            "A2": "A2.mp3",
            "C3": "C3.mp3",
            "D#3": "Ds3.mp3",
            "F#3": "Fs3.mp3",
            "A3": "A3.mp3",
            "C4": "C4.mp3",
            "D#4": "Ds4.mp3",
            "F#4": "Fs4.mp3",
            "A4": "A4.mp3",
            "C5": "C5.mp3",
            "D#5": "Ds5.mp3",
            "F#5": "Fs5.mp3",
            "A5": "A5.mp3",
            "C6": "C6.mp3",
            "D#6": "Ds6.mp3",
            "F#6": "Fs6.mp3",
            "A6": "A6.mp3",
            "C7": "C7.mp3",
            "D#7": "Ds7.mp3",
            "F#7": "Fs7.mp3",
            "A7": "A7.mp3",
            "C8": "C8.mp3"
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
        onload: () => console.log('Piano samples loaded')
    }).toDestination()
}

// Set default instrument sound
instrumentSound = instrumentsSelection['mono synth']; 
// instrumentElement.value = 'mono synth'; // set default option

// instrumentElement.addEventListener('change', async function(){
//     instrument = instrumentElement.value;
//     console.log('instrument changed!: ', instrument);
//     instrumentSound = instrumentsSelection[instrument];
// })
// Get all radio buttons with name 'instrument'
let instrumentElements = document.querySelectorAll('input[name="instrument"]');

// Add event listeners to each radio button
instrumentElements.forEach(radio => {
    radio.addEventListener('change', function() {
        if (radio.checked) {
            instrument = radio.value;
            console.log('instrument changed!: ', instrument);
            instrumentSound = instrumentsSelection[instrument];
        }
    });
});

// Trigger change event on the checked radio button to set the default instrument
document.querySelector('input[name="instrument"]:checked').dispatchEvent(new Event('change'));

//const synth = new Tone.Synth().toDestination(); // define a mono synth and route it to your speakers

async function playMelody(melody, noteLengths){
    if (!isToneStarted) {
        await Tone.start();
        isToneStarted = true;
        console.log('enabling buttons');
        replayBtn.disabled = false;
        exportBtn.disabled = false;
    }
    // console.log('a fourth note in seconds: ', Tone.Time("4n").toSeconds()); => 0.5
    // Stop any previous notes to avoid endless sound
    let now = Tone.now();
    //console.log('Tone.now() before the for loop', Tone.now());
    let accumulatedTime = 0;
    let restDuration = 0.2; // 100ms rest between notes
    for (let i = 0; i < melody.length; i++) {
        //console.log(`Playing note: ${melody[i]} for duration: ${noteLengths[i]} at time: ${now + accumulatedTime}`);
        instrumentSound.triggerAttackRelease(melody[i], noteLengths[i], now + accumulatedTime);
        accumulatedTime += Tone.Time(noteLengths[i]).toSeconds() + restDuration;
        //console.log('Tone.now() inside the for loop', Tone.now());
    }
}


replayBtn.addEventListener('click', () => { 
    //console.log('playing last generated melody: ', savedMelodyComponents.melodyLine);
    playMelody(savedMelodyComponents.melodyLine, savedMelodyComponents.noteLengths);
})

generateBtn.addEventListener('click', () => {
    let newMelodyComponenets = generateMelody();
    let newMelody = newMelodyComponenets.melodyLine
    let newNoteLengths = newMelodyComponenets.noteLengths;
    console.log('melody generated: ', newMelody, 'with lengths ', newNoteLengths);
    // display the note progression on the page
    // let displayedMelodyString = newMelody.join(', ');
    // melodyNotesContainer.innerText = displayedMelodyString;
    // generatedMusicContainer.appendChild(melodyNotesContainer);
    playMelody(newMelody, newNoteLengths);
    cleanMelody();
    visualiseMelody(newMelody);
    visualiseMelodyOnScore(newMelody);
})

function visualiseMelody(melody){
    let noteTimelinePosition = 0; // this var will be used to calculate the left position of each note
    let i = 0;
    let k = 0;
    for(i; i < melody.length; i++){ // for each melody note
        //console.log('enter for(i): ', melody[i]);
        for(k; k < allNoteLanes.length; k++){
            //console.log('enter for(k): ', allNoteLanes[k]);
            if (allNoteLanes[k].dataset.value === melody[i]){
                //console.log('match found: ', allNoteLanes[k], ' and ', melody[i]);
                let note = document.createElement("div");
                note.style.left = `${noteTimelinePosition}px`;
                note.className = 'note';
                allNoteLanes[k].appendChild(note);
                noteTimelinePosition += 55; // 50 is the width of the notes, 5 is the gap between them
            }
        }
        k = 0;
    }
}

let musicNotesVerticalPositions = {
    "C4": "170px",
    "D4": "160px", 
    "E4": "140px", 
    "Eb4": "140px", 
    "F4": "120px", 
    "G4": "100px", 
    "A4": "80px", 
    "Ab4": "80px", 
    "B4": "60px", 
    "Bb4": "60px" 
}
function visualiseMelodyOnScore(melody){
    
    let i = 0;
    for(i; i < melody.length; i++){ // for each melody note
        let musicNotePosition = musicNotesVerticalPositions[melody[i]]; // map the vertical position of each note
        //console.log('horizontal position for note ', melody[i], 'is ', noteTimelinePositionOnScore);
        let musicNote = document.createElement("div");
        musicNote.style.top = musicNotePosition;
        musicNote.style.left = `${noteTimelinePositionOnScore}px`;
        if(melody[i] === "C4"){ // for the note 'C' add an additional line through it with CSS
            musicNote.classList.add("note-line");
        }
        musicNote.classList.add("music-note");
        musicScoreContainer.appendChild(musicNote);
        noteTimelinePositionOnScore += 60;
    }
}

function cleanMelody(){ // removes all the .note dom elements once a new melody is generated
                        // source: https://www.geeksforgeeks.org/remove-all-the-child-elements-of-a-dom-node-in-javascript/
    for(let i = 0; i < allNoteLanes.length; i++){ // clean the notes in the piano roll
        let child = allNoteLanes[i].lastElementChild;
        while (child){
            allNoteLanes[i].removeChild(child);
            child = allNoteLanes[i].lastElementChild;
        }
    }

    // clean the notes in the music score
    musicScoreContainer.innerHTML = "";
}

// export melody as MIDI file
async function exportMelody(){
    let track = new MidiWriter.Track(); // define a new track
    let melody = savedMelodyComponents.melodyLine; // get the last played melody and note lengths
    let noteLengths = savedMelodyComponents.noteLengths;
    noteLengths = noteLengths.map(item => item.slice(0, -1)); // remove the 'n' from each note lengths
    melody.forEach((note, index) => { // define the midi notes and their duration
        let noteDuration = noteLengths[index];
        track.addEvent(new MidiWriter.NoteEvent({pitch: [note], duration: [noteDuration]}))
    });
    // Create a write instance
    let write = new MidiWriter.Writer(track);
    // Output the MIDI file as a base64 string
    let midiString = write.base64();
    console.log(midiString);
    // save the file to disk
    fetch('/save-midi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ midiData: midiString }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        if (blob.size === 0) {
            throw new Error('Received an empty blob');
        }
        // Get the hidden link element
        const link = document.querySelector('#download-link');
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Set the link's href to point to the blob URL
        link.href = url;
        // Set the download attribute to specify the filename
        link.download = 'output.mid';
        // Programmatically click the link to trigger the download
        link.click();
        // Revoke the object URL to free up resources
        window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    // try {
    //     let response = await fetch('http://localhost:3000/save-midi', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ midiData: midiString }),
    //     });
    //     console.log('Response status:', response.status);
    //     if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     if(response.ok){
    //         let data = await response.json();
    //         console.log('Server says: ', data);
    //         // when the response message is sent, display a message indicating successful save
    //         exportMsg.style.display = 'block';
    //         setTimeout(() => {
    //             exportMsg.style.display = 'none';
    //         }, 5000);
    //     }
    // } catch (error) {
    //     console.error('Export error: ', error);
    // }
}
// execute the export function on button click
exportBtn.addEventListener('click', () => exportMelody());

// change note color
console.log('Note color elements:', noteColorElements);
noteColorElements.forEach(element => {
    console.log('Attaching event listener to:', element);
    element.addEventListener('click', changeNoteColor)
})
function changeNoteColor(event) {
    let selectedColor = event.target.getAttribute('data-color');
    localStorage.setItem('noteColor', selectedColor);
    console.log('Selected color:', selectedColor);
    // change the css variable for the note color
    document.documentElement.style.setProperty('--note-color', selectedColor); 
}


// randomize note breaks

// npm run dev 
