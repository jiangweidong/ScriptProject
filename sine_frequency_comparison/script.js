const sineCanvas = document.getElementById('sineCanvas');
const sineCtx = sineCanvas.getContext('2d');
const fftCanvas = document.getElementById('fftCanvas');
const fftCtx = fftCanvas.getContext('2d');

const width = 800;
const height = 400;
sineCanvas.width = width;
sineCanvas.height = height;
fftCanvas.width = width;
fftCanvas.height = height / 2;

const amplitude = 150;
const frequency1 = 2;
const frequency2 = 5;
const waveColor1 = 'blue';
const waveColor2 = 'red';
const combinedColor = 'purple';

let time = 0;

// Simple DFT function
function dft(signal) {
    const N = signal.length;
    const spectrum = [];
    for (let k = 0; k < N / 2; k++) {
        let re = 0;
        let im = 0;
        for (let n = 0; n < N; n++) {
            const angle = (2 * Math.PI * k * n) / N;
            re += signal[n] * Math.cos(angle);
            im -= signal[n] * Math.sin(angle);
        }
        re = re / N;
        im = im / N;
        spectrum[k] = { re, im, freq: k, amp: Math.sqrt(re * re + im * im) };
    }
    return spectrum;
}


function draw() {
    // --- Draw Time Domain Signal ---
    sineCtx.clearRect(0, 0, width, height);
    sineCtx.strokeStyle = '#aaa';
    sineCtx.lineWidth = 1;
    sineCtx.beginPath();
    sineCtx.moveTo(0, height / 2);
    sineCtx.lineTo(width, height / 2);
    sineCtx.stroke();

    const signal = [];
    const combinedSignal = [];

    // Draw first sine wave and generate signal
    sineCtx.beginPath();
    sineCtx.strokeStyle = waveColor1;
    sineCtx.lineWidth = 1;
    for (let x = 0; x < width; x++) {
        const y = amplitude * Math.sin((x + time) * Math.PI / 180 * frequency1);
        signal.push(y);
        sineCtx.lineTo(x, height / 2 + y);
    }
    sineCtx.stroke();

    // Draw second sine wave and add to signal
    sineCtx.beginPath();
    sineCtx.strokeStyle = waveColor2;
    sineCtx.lineWidth = 1;
    for (let x = 0; x < width; x++) {
        const y1 = signal[x];
        const y2 = amplitude * Math.sin((x + time) * Math.PI / 180 * frequency2);
        combinedSignal.push(y1 + y2);
        sineCtx.lineTo(x, height / 2 + y2);
    }
    sineCtx.stroke();
    
    // Draw combined wave
    sineCtx.beginPath();
    sineCtx.strokeStyle = combinedColor;
    sineCtx.lineWidth = 2;
    for (let x = 0; x < width; x++) {
        sineCtx.lineTo(x, height / 2 + combinedSignal[x] / 2); // divide by 2 to keep in view
    }
    sineCtx.stroke();


    // --- Draw Frequency Domain (FFT) ---
    fftCtx.clearRect(0, 0, fftCanvas.width, fftCanvas.height);
    const spectrum = dft(combinedSignal);

    fftCtx.strokeStyle = '#aaa';
    fftCtx.lineWidth = 1;
    fftCtx.beginPath();
    fftCtx.moveTo(0, fftCanvas.height - 1);
    fftCtx.lineTo(fftCanvas.width, fftCanvas.height - 1);
    fftCtx.stroke();

    fftCtx.beginPath();
    fftCtx.strokeStyle = 'green';
    fftCtx.lineWidth = 2;
    for (let i = 0; i < spectrum.length; i++) {
        const x = i * (fftCanvas.width / (spectrum.length));
        const y = fftCanvas.height - (spectrum[i].amp * 2); // Scale amplitude for visibility
        fftCtx.lineTo(x, y);
    }
    fftCtx.stroke();


    // Add labels
    sineCtx.fillStyle = waveColor1;
    sineCtx.font = '16px sans-serif';
    sineCtx.fillText('Frequency: ' + frequency1, 10, 30);
    sineCtx.fillStyle = waveColor2;
    sineCtx.fillText('Frequency: ' + frequency2, 10, 50);
    sineCtx.fillStyle = combinedColor;
    sineCtx.fillText('Combined Signal', 10, 70);


    time += 1;
    requestAnimationFrame(draw);
}

draw();
