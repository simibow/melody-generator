import { Note, Scale, ScaleType, Chord } from "tonal"; // imports the specified modules from the Tonal.js library
import * as Tone from "tone";


// The join() method of Array instances creates and returns a new string by concatenating all of the elements in this array, 
// separated by commas or a specified separator string. If the array has only one item, then that item will be returned 
// without using the separator. 

let everyScale = Scale.names().join(', ');

let generatedMusicContainer = document.querySelector('section.generated-music');
let scalesContainer = document.createElement('div');
scalesContainer.innerText = everyScale;
generatedMusicContainer.appendChild(scalesContainer);

// detect scales
//console.log('detected scale from given notes is: ', Scale.detect(["C", "D", "G#", "A", "B"], { tonic: "A" }));

// print all scale type
// let nonPentatonicScales = ScaleType.all()
// .filter((scaleType) => scaleType.intervals.length === 7);

//console.log('all scale types: ', nonPentatonicScales);

// detect chords
//console.log('chord detected is : ', Chord.detect(["D", "G", "C"]));

let savedMelody;

function generateMelody(){
    // randomize melody length - number of notes - keep it short
    let minMelodyLength = 7;
    let maxMelodyLength = 15;
    let melodyLength;
    melodyLength = Math.floor(Math.random() * (maxMelodyLength - minMelodyLength + 1)) + minMelodyLength;
    //console.log('melodyLength is ', melodyLength);
    //let notes = new Array(melodyLength);
    let notes = [];

    // randomize pitch
    // for now lets hardcode the scale as major and the key as C
    let scaleNotes = Scale.get("C major").notes;

    function getRandomScaleNote(){
        return Math.floor(Math.random() * scaleNotes.length); // returns random int from 0 to 6
    }
    function createNoteProgression(){
        for (let i=0; i<melodyLength; i++){
            notes.push(getRandomScaleNote())
        }
        return notes;
    }
    notes = createNoteProgression();
    //console.log('random note progression: ', createNoteProgression());

    let mappedNotes = notes.map(item => scaleNotes[item]); // index refers to the item, not the index of it
    //console.log('mappedNotes is ', mappedNotes);

    // lets play the melody without randomizing note length and breaks
    // play the melody in the 4th octave
    // add a 4 to each item in the mappedNotes array
    mappedNotes = mappedNotes.map(note => note.concat('4'));
    console.log('mappedNotes is ', mappedNotes);
    savedMelody = mappedNotes;
    return mappedNotes;
}


// play
const synth = new Tone.Synth().toDestination(); // define a mono synth and 

async function playMelody(melody){
    await Tone.start();
    let now = 0;
    synth.triggerAttackRelease(melody[0], "8n", now);
    synth.triggerAttackRelease(melody[1], "8n", now + 0.5);
    synth.triggerAttackRelease(melody[2], "8n", now + 1);
    synth.triggerAttackRelease(melody[3], "8n", now + 1.5);
    synth.triggerAttackRelease(melody[4], "8n", now + 2);
    synth.triggerAttackRelease(melody[5], "8n", now + 2.5);
    synth.triggerAttackRelease(melody[6], "8n", now + 3);
    
}


let replayBtn = document.querySelector('#replay');
replayBtn.addEventListener('click', () => { 
    console.log('playing last generated melody: ', savedMelody);
    playMelody(savedMelody);
    replayBtn.removeEventListener;
    replayBtn.addEventListener('click', playMelody)
})

let generateBtn = document.querySelector('#generate');
generateBtn.addEventListener('click', () => {
    let newMelody = generateMelody();
    console.log('melody generated: ', newMelody);
    playMelody(newMelody);
    generateBtn.removeEventListener;
    generateBtn.addEventListener('click', playMelody)
})

// randomize note length

// randomize note breaks

// npm run dev 
