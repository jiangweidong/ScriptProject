document.addEventListener('DOMContentLoaded', () => {
    const piano = document.querySelector('.piano');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
        'fur-elise': [
            ['E5', 0.2], ['Eb5', 0.2], ['E5', 0.2], ['Eb5', 0.2], ['E5', 0.2], ['B4', 0.2], ['D5', 0.2], ['C5', 0.2], ['A4', 0.4],
            ['C4', 0.2], ['E4', 0.2], ['A4', 0.2], ['B4', 0.4], ['E4', 0.2], ['Ab4', 0.2], ['B4', 0.2], ['C5', 0.4],
            ['E5', 0.2], ['Eb5', 0.2], ['E5', 0.2], ['Eb5', 0.2], ['E5', 0.2], ['B4', 0.2], ['D5', 0.2], ['C5', 0.2], ['A4', 0.4],
            ['C4', 0.2], ['E4', 0.2], ['A4', 0.2], ['B4', 0.4], ['E4', 0.2], ['C5', 0.2], ['B4', 0.2], ['A4', 0.4]
        ],
        'castle-in-the-sky': [
            ['A4', 0.4], ['B4', 0.2], ['C5', 0.4], ['B4', 0.4], ['D5', 0.4], ['C5', 0.8],
            ['G4', 0.4], ['A4', 0.2], ['B4', 0.4], ['A4', 0.4], ['C5', 0.4], ['B4', 0.8],
            ['A4', 0.4], ['G4', 0.2], ['A4', 0.4], ['G4', 0.4], ['F4', 0.4], ['E4', 0.8],
            ['F4', 0.4], ['D4', 0.4], ['C4', 0.4], ['D4', 0.4], ['G4', 0.4], ['A3', 0.8]
        ],
        'dolls-and-bears': [
            ['G4', 0.2], ['G4', 0.2], ['A4', 0.2], ['G4', 0.2], ['F4', 0.4], ['F4', 0.4], ['D4', 0.2], ['D4', 0.2], ['G4', 0.2], ['D4', 0.2], ['C4', 0.4], ['C4', 0.4],
            ['G4', 0.2], ['G4', 0.2], ['A4', 0.2], ['G4', 0.2], ['F4', 0.4], ['F4', 0.4], ['D4', 0.2], ['D4', 0.2], ['G4', 0.2], ['C4', 0.2], ['D4', 0.8]
        ],
        'canon': [
            ['F5', 0.4], ['E5', 0.4], ['D5', 0.4], ['C5', 0.4], ['B4', 0.4], ['A4', 0.4], ['B4', 0.4], ['C5', 0.4],
            ['D5', 0.4], ['C5', 0.4], ['B4', 0.4], ['A4', 0.4], ['G4', 0.4], ['F4', 0.4], ['G4', 0.4], ['A4', 0.4],
            ['B4', 0.4], ['A4', 0.4], ['G4', 0.4], ['F4', 0.4], ['E4', 0.4], ['D4', 0.4], ['E4', 0.4], ['F4', 0.4],
            ['G4', 0.4], ['A4', 0.4], ['B4', 0.4], ['C5', 0.4], ['D5', 0.4], ['E5', 0.4], ['F5', 0.4], ['G5', 0.4]
        ]
    };

    const playBtn = document.getElementById('play-btn');
    const songSelect = document.getElementById('song-select');

    function playSong(song) {
        let currentTime = 0;
        song.forEach(noteInfo => {
            const [noteName, duration] = noteInfo;
            setTimeout(() => {
                if (noteName) {
                    const keyElement = document.querySelector(`.key[data-note="${noteName}"]`);
                    const noteData = allNotes.find(n => n.name === noteName);
                    if (keyElement && noteData) {
                        playNote(noteData, keyElement);
                    }
                }
            }, currentTime * 1000);
            currentTime += duration;
        });
    }

    playBtn.addEventListener('click', () => {
        const songId = songSelect.value;
        const song = songs[songId];
        if (song) {
            playSong(song);
        }
    });
});
