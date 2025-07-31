document.addEventListener('DOMContentLoaded', () => {
    const piano = document.querySelector('.piano');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const metronome = document.getElementById('metronome');

    const allNotes = [];
    const noteNames = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];
    let keyCount = 0;
    let octave = 0;

    // Start with A0, B0
    for (let i = 0; i < 3; i++) {
        const noteName = noteNames[i % 12];
        if (noteName === "C") octave++;
        allNotes.push({ name: noteName + octave, isBlack: noteName.includes('b'), frequency: 440 * Math.pow(2, (keyCount - 48) / 12) });
        keyCount++;
    }

    // Octaves 1 through 7
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 12; j++) {
            const noteName = noteNames[(j + 3) % 12];
            if (noteName === "C") octave++;
            allNotes.push({ name: noteName + octave, isBlack: noteName.includes('b'), frequency: 440 * Math.pow(2, (keyCount - 48) / 12) });
            keyCount++;
        }
    }

    // Add C8
    allNotes.push({ name: "C8", isBlack: false, frequency: 440 * Math.pow(2, (keyCount - 48) / 12) });

    let whiteKeyLeft = 0;
    allNotes.forEach(note => {
        const key = document.createElement('div');
        key.classList.add('key');
        key.classList.add(note.isBlack ? 'black' : 'white');
        key.dataset.note = note.name;

        if (note.isBlack) {
            key.style.left = `${whiteKeyLeft - 12.5}px`;
        } else {
            key.style.left = `${whiteKeyLeft}px`;
            whiteKeyLeft += 40;
        }
        
        piano.appendChild(key);
        key.addEventListener('click', () => playNote(note, key));
    });
    piano.style.width = `${whiteKeyLeft}px`;


    function playNote(note, keyElement) {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note.frequency, audioContext.currentTime);

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);

        keyElement.classList.add('active');
        setTimeout(() => {
            keyElement.classList.remove('active');
        }, 200);
    }

    const songs = {
        'fur-elise': {
            bpm: 100,
            notes: [
                ['E5', 0.25], ['Eb5', 0.25], ['E5', 0.25], ['Eb5', 0.25], ['E5', 0.25], ['B4', 0.25], ['D5', 0.25], ['C5', 0.25], ['A4', 0.5],
                ['C4', 0.25], ['E4', 0.25], ['A4', 0.25], ['B4', 0.5], ['E4', 0.25], ['Ab4', 0.25], ['B4', 0.25], ['C5', 0.5],
                ['E5', 0.25], ['Eb5', 0.25], ['E5', 0.25], ['Eb5', 0.25], ['E5', 0.25], ['B4', 0.25], ['D5', 0.25], ['C5', 0.25], ['A4', 0.5],
                ['C4', 0.25], ['E4', 0.25], ['A4', 0.25], ['B4', 0.5], ['E4', 0.25], ['C5', 0.25], ['B4', 0.25], ['A4', 0.5],
                ['B4', 0.25], ['C5', 0.25], ['D5', 0.25], ['E5', 0.5], ['G4', 0.25], ['F5', 0.25], ['E5', 0.25], ['D5', 0.5],
                ['F4', 0.25], ['E5', 0.25], ['D5', 0.25], ['C5', 0.5], ['E4', 0.25], ['D5', 0.25], ['C5', 0.25], ['B4', 0.5]
            ]
        },
        'castle-in-the-sky': {
            bpm: 120,
            notes: [
                ['A4', 0.5], ['B4', 0.25], ['C5', 0.5], ['B4', 0.25], ['C5', 0.5], ['D5', 0.5], ['C5', 1],
                ['G4', 0.5], ['A4', 0.25], ['B4', 0.5], ['A4', 0.25], ['B4', 0.5], ['C5', 0.5], ['B4', 1],
                ['A4', 0.5], ['G4', 0.25], ['A4', 0.5], ['G4', 0.25], ['F4', 0.5], ['E4', 0.5], ['F4', 1],
                ['D4', 0.5], ['E4', 0.25], ['F4', 0.5], ['E4', 0.25], ['F4', 0.5], ['G4', 0.5], ['A4', 1]
            ]
        },
        'dolls-and-bears': {
            bpm: 140,
            notes: [
                ['G4', 0.25], ['G4', 0.25], ['A4', 0.25], ['G4', 0.25], ['F4', 0.5], ['F4', 0.5],
                ['D4', 0.25], ['D4', 0.25], ['G4', 0.25], ['D4', 0.25], ['C4', 0.5], ['C4', 0.5],
                ['G4', 0.25], ['G4', 0.25], ['A4', 0.25], ['G4', 0.25], ['F4', 0.5], ['F4', 0.5],
                ['D4', 0.25], ['D4', 0.25], ['G4', 0.25], ['C4', 0.25], ['D4', 1]
            ]
        },
        'canon': {
            bpm: 100,
            notes: [
                ['F5', 0.5], ['E5', 0.5], ['D5', 0.5], ['C5', 0.5], ['B4', 0.5], ['A4', 0.5], ['B4', 0.5], ['C5', 0.5],
                ['D5', 0.5], ['C5', 0.5], ['B4', 0.5], ['A4', 0.5], ['G4', 0.5], ['F4', 0.5], ['G4', 0.5], ['A4', 0.5],
                ['B4', 0.5], ['A4', 0.5], ['G4', 0.5], ['F4', 0.5], ['E4', 0.5], ['D4', 0.5], ['E4', 0.5], ['F4', 0.5],
                ['G4', 0.5], ['A4', 0.5], ['B4', 0.5], ['C5', 0.5], ['D5', 0.5], ['E5', 0.5], ['F5', 0.5], ['G5', 0.5]
            ]
        }
    };

    const playBtn = document.getElementById('play-btn');
    const songSelect = document.getElementById('song-select');
    let metronomeInterval = null;

    function playSong(song) {
        if (metronomeInterval) {
            clearInterval(metronomeInterval);
        }

        const beatDuration = 60 / song.bpm;
        let totalDuration = 0;
        
        metronomeInterval = setInterval(() => {
            metronome.classList.add('active');
            setTimeout(() => metronome.classList.remove('active'), 100);
        }, beatDuration * 1000);

        let currentTime = 0;
        song.notes.forEach(noteInfo => {
            const [noteName, duration] = noteInfo;
            totalDuration += duration * beatDuration;
            setTimeout(() => {
                if (noteName) {
                    const keyElement = document.querySelector(`.key[data-note="${noteName}"]`);
                    const noteData = allNotes.find(n => n.name === noteName);
                    if (keyElement && noteData) {
                        playNote(noteData, keyElement);
                    }
                }
            }, currentTime * 1000);
            currentTime += duration * beatDuration;
        });

        setTimeout(() => {
            clearInterval(metronomeInterval);
            metronomeInterval = null;
        }, totalDuration * 1000);
    }

    playBtn.addEventListener('click', () => {
        const songId = songSelect.value;
        const song = songs[songId];
        if (song) {
            playSong(song);
        }
    });
});
