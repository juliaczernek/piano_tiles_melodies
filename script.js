const notesContainer = document.querySelector('.notes-container');

const songs = {
    jingleBells: [
        // "Jingle bells, jingle bells"
        { note: 'E', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'E', duration: 2 },
        
        { note: 'E', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'E', duration: 2 },
        
        // "Jingle all the way"
        { note: 'E', duration: 1 },
        { note: 'G', duration: 1 },
        { note: 'C', duration: 1 },
        { note: 'D', duration: 1 },
        { note: 'E', duration: 4 },
        
        // "Oh what fun it is to ride"
        { note: 'F', duration: 1 },
        { note: 'F', duration: 1 },
        { note: 'F', duration: 1 },
        { note: 'F', duration: 1 },
        
        { note: 'F', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'E', duration: 1 },
        
        // "In a one-horse open sleigh"
        { note: 'E', duration: 1 },
        { note: 'D', duration: 1 },
        { note: 'D', duration: 1 },
        { note: 'E', duration: 1 },
        
        { note: 'D', duration: 2 },
        { note: 'G', duration: 2 }
    ],
    odeToJoy: [
        // Section 1
        { note: 'E', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'F', duration: 1 },
        { note: 'G', duration: 1 },
        { note: 'G', duration: 1 },
        { note: 'F', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'D', duration: 1 },
        { note: 'C', duration: 1 },
        { note: 'C', duration: 1 },
        { note: 'D', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'D', duration: 1 },
        { note: 'D', duration: 1 },
        // Section 2 (repeat)
        { note: 'E', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'F', duration: 1 },
        { note: 'G', duration: 1 },
        { note: 'G', duration: 1 },
        { note: 'F', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'D', duration: 1 },
        { note: 'C', duration: 1 },
        { note: 'C', duration: 1 },
        { note: 'D', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'D', duration: 1 },
        { note: 'C', duration: 1 },
        { note: 'C', duration: 1 }
    ],
    twinkleTwonkle: [
        // C C G G A A G
        { note: 'C', duration: 1 },
        { note: 'C', duration: 1 },
        { note: 'G', duration: 1 },
        { note: 'G', duration: 1 },
        { note: 'A', duration: 1 },
        { note: 'A', duration: 1 },
        { note: 'G', duration: 1 },
        // F F E E D D C
        { note: 'F', duration: 1 },
        { note: 'F', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'D', duration: 1 },
        { note: 'D', duration: 1 },
        { note: 'C', duration: 1 },
        // G G F F E E D
        { note: 'G', duration: 1 },
        { note: 'G', duration: 1 },
        { note: 'F', duration: 1 },
        { note: 'F', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'D', duration: 1 },
        // G G F F E E D (repeat)
        { note: 'G', duration: 1 },
        { note: 'G', duration: 1 },
        { note: 'F', duration: 1 },
        { note: 'F', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'E', duration: 1 },
        { note: 'D', duration: 1 }
    ]
};

let currentSong = 'jingleBells';
let currentNoteIndex = 0;
let gameRunning = true;
let nextNoteTimeout = null;

const bpm = 100;
const beatDuration = 60000 / bpm;
const fallDuration = 9;


function createNote(noteName) {
    if (!gameRunning) return;

    const note = document.createElement('div');
    note.classList.add('note');
    note.classList.add(`key-${noteName}`);
    note.textContent = noteName;

    note.style.animation = `fall ${fallDuration}s linear`;
    
    notesContainer.appendChild(note);
    
    setTimeout(() => {
        note.remove();
    }, fallDuration * 1000);
}


function createStartLine() {
    if (!gameRunning) return;

    const line = document.createElement('div');
    line.classList.add('start-line');
    line.style.animation = `fall ${fallDuration}s linear`;
    
    notesContainer.appendChild(line);
    
    setTimeout(() => {
        line.remove();
    }, fallDuration * 1000);
}

function playNextNote() {
    if (!gameRunning) return;

    const noteSequence = songs[currentSong];

    if (currentNoteIndex < noteSequence.length) {
        const currentNote = noteSequence[currentNoteIndex];
        createNote(currentNote.note);
        
        // Schedule next note based on current note's duration
        const waitTime = beatDuration * currentNote.duration;
        nextNoteTimeout = setTimeout(() => {
            currentNoteIndex++;
            playNextNote();
        }, waitTime);
    } else {

        createStartLine();
        // Loop back to start after a pause
        nextNoteTimeout = setTimeout(() => {
            currentNoteIndex = 0;
            playNextNote();
        }, beatDuration * 4); // 4 beat pause before looping
    }
}


function stopCurrentSong(){
    gameRunning = false;
    if (nextNoteTimeout){
        clearTimeout(nextNoteTimeout);
    }
    notesContainer.innerHTML='';
}

function startSong(songName){
    stopCurrentSong();
    currentSong = songName;
    currentNoteIndex = 0;
    gameRunning = true;
    playNextNote();
}

const songButtons = document.querySelectorAll('.song-button');
songButtons.forEach(button => {
    button.addEventListener('click', ()=>{
        songButtons.forEach(button=>button.classList.remove('active'));
        button.classList.add('active');
        const songName = button.getAttribute('data-song');
        startSong(songName);
    })
})

const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        from {
            top: -150px;
            opacity: 1;
        }
        to {
            top: calc(200vh - 200px);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

playNextNote();