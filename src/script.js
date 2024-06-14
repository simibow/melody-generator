import { Note, Scale, ScaleType, Chord } from "tonal"; // imports the specified modules from the Tonal.js library, which is used to refer to music theory
import * as Tone from "tone"; // Tone.js is the API for playing the sounds
import { log } from "tone/build/esm/core/util/Debug";


// The join() method of Array instances creates and returns a new string by concatenating all of the elements in this array, 
// separated by commas or a specified separator string. If the array has only one item, then that item will be returned 
// without using the separator. 

// let everyScale = Scale.names().join(', ');

// let generatedMusicContainer = document.querySelector('section.generated-music');
// let scalesContainer = document.createElement('div');
// scalesContainer.innerText = everyScale;
// generatedMusicContainer.appendChild(scalesContainer);

// detect scales
//console.log('detected scale from given notes is: ', Scale.detect(["C", "D", "G#", "A", "B"], { tonic: "A" }));

// print all scale type
// let nonPentatonicScales = ScaleType.all()
// .filter((scaleType) => scaleType.intervals.length === 7);

//console.log('all scale types: ', nonPentatonicScales);

// detect chords
//console.log('chord detected is : ', Chord.detect(["D", "G", "C"]));

let savedMelodyComponents = {};
let isToneStarted = false;
// define a list of note lengths to be used in the melody generation
let noteLengthsSelection = [ "8n", "4n", "8n", "8n", "8n", "8n", "8n"]; // "16n", "8n", "4n", "16n.", "8n.", "4n."
let noteLengths = [];
let generatedMusicContainer = document.querySelector('section.generated-music'); // where the note progression will be displayed on the page
let melodyNotesContainer = document.createElement('div');
// get all the containers for the notes
// where the melody will be visualised
// let CLaneContainer = document.querySelector('.c-lane');
// let DLaneContainer = document.querySelector('.d-lane');
// let ELaneContainer = document.querySelector('.e-lane');
// let FLaneContainer = document.querySelector('.f-lane');
// let GLaneContainer = document.querySelector('.g-lane');
// let ALaneContainer = document.querySelector('.a-lane');
// let BLaneContainer = document.querySelector('.b-lane');
// get a node list of the note containers
let allNoteLanes = document.querySelectorAll('.note-lane');
// console.log('allNoteLanes is ', allNoteLanes);
// console.log('CLaneContainer is ', CLaneContainer);

function generateMelody(){
    // randomize melody length - number of notes - keep it short
    let minMelodyLength = 7;
    let maxMelodyLength = 15;
    let melodyLength = 0;
    melodyLength = Math.floor(Math.random() * (maxMelodyLength - minMelodyLength + 1)) + minMelodyLength;
    //console.log('melodyLength is ', melodyLength);
    //let notes = new Array(melodyLength);
    let notes = [];
    noteLengths = []; // reset the array
    // randomize pitch
    // for now lets hardcode the scale as major and the key as C
    let scaleNotes = Scale.get("C major").notes;
    // document.getElementById("checkbox_id").checked => returns true if checked

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


// play
const synth = new Tone.Synth().toDestination(); // define a mono synth and route it to your speakers

async function playMelody(melody, noteLengths){
    if (!isToneStarted) {
        await Tone.start();
        isToneStarted = true;
    }
    // console.log('a fourth note in seconds: ', Tone.Time("4n").toSeconds()); => 0.5
    // Stop any previous notes to avoid endless sound
    //Tone.Transport.stop();
    //Tone.Transport.cancel();
    let now = Tone.now();
    //console.log('Tone.now() before the for loop', Tone.now());
    let accumulatedTime = 0;
    let restDuration = 0.2; // 100ms rest between notes
    for (let i = 0; i < melody.length; i++) {
        //console.log(`Playing note: ${melody[i]} for duration: ${noteLengths[i]} at time: ${now + accumulatedTime}`);
        synth.triggerAttackRelease(melody[i], noteLengths[i], now + accumulatedTime);
        accumulatedTime += Tone.Time(noteLengths[i]).toSeconds() + restDuration;
        //console.log('Tone.now() inside the for loop', Tone.now());
    }
    //Tone.Transport.start();
}


let replayBtn = document.querySelector('#replay');
replayBtn.addEventListener('click', () => { 
    //console.log('playing last generated melody: ', savedMelodyComponents.melodyLine);
    playMelody(savedMelodyComponents.melodyLine, savedMelodyComponents.noteLengths);
})

let generateBtn = document.querySelector('#generate');
generateBtn.addEventListener('click', () => {
    let newMelodyComponenets = generateMelody();
    let newMelody = newMelodyComponenets.melodyLine
    let newNoteLengths = newMelodyComponenets.noteLengths;
    console.log('melody generated: ', newMelody, 'with lengths ', newNoteLengths);
    // display the note progression on the page
    let displayedMelodyString = newMelody.join(', ');
    melodyNotesContainer.innerText = displayedMelodyString;
    generatedMusicContainer.appendChild(melodyNotesContainer);
    playMelody(newMelody, newNoteLengths);
    cleanMelody();
    visualiseMelody(newMelody);
})

function visualiseMelody(melody){
    let noteTimelinePosition = 0; // this var will be used to calculate the left position of each note
    let i = 0;
    let k = 0;
    for(i; i < melody.length; i++){ // for each melody note
        console.log('enter for(i): ', melody[i]);
        for(k; k < allNoteLanes.length; k++){
            console.log('enter for(k): ', allNoteLanes[k]);
            if (allNoteLanes[k].dataset.value === melody[i]){
                console.log('match found: ', allNoteLanes[k], ' and ', melody[i]);
                let note = document.createElement("div");
                note.style.left = `${noteTimelinePosition}px`;
                note.className = 'note';
                allNoteLanes[k].appendChild(note);
                noteTimelinePosition += 55; // 50 is the width of the notes, 5 is the gap between them
            }
            //k = 0; // endless loop
        }
        k = 0;
    }
}

function cleanMelody(){ // removes all the .note dom elements once a new melody is generated
                        // source: https://www.geeksforgeeks.org/remove-all-the-child-elements-of-a-dom-node-in-javascript/
    for(let i = 0; i < allNoteLanes.length; i++){ // for each note lane container
        let child = allNoteLanes[i].lastElementChild;
        while (child){
            allNoteLanes[i].removeChild(child);
            child = allNoteLanes[i].lastElementChild;
        }
    }
}


// randomize note breaks

// npm run dev 
