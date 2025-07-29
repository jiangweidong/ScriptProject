const canvas = document.getElementById('fourierCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

let time = 0;
const path = [];

function dft(x) {
    const X = [];
    const N = x.length;
    for (let k = 0; k < N; k++) {
        let re = 0;
        let im = 0;
        for (let n = 0; n < N; n++) {
            const phi = (2 * Math.PI * k * n) / N;
            re += x[n] * Math.cos(phi);
            im -= x[n] * Math.sin(phi);
        }
        re = re / N;
        im = im / N;

        let freq = k;
        let amp = Math.sqrt(re * re + im * im);
        let phase = Math.atan2(im, re);
        X[k] = { re, im, freq, amp, phase };
    }
    return X;
}

const signalX = [];
const signalY = [];
const nPoints = 100;
for (let i = 0; i < nPoints; i++) {
    const t = (i / nPoints) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    signalX.push(x * 10); // Scale for visibility
    signalY.push(-y * 10); // Scale and invert Y
}

const fourierX = dft(signalX);
const fourierY = dft(signalY);

fourierX.sort((a, b) => b.amp - a.amp);
fourierY.sort((a, b) => b.amp - a.amp);

function epiCycles(x, y, rotation, fourier) {
    for (let i = 0; i < fourier.length; i++) {
        const prevx = x;
        const prevy = y;
        const freq = fourier[i].freq;
        const radius = fourier[i].amp;
        const phase = fourier[i].phase;
        x += radius * Math.cos(freq * time + phase + rotation);
        y += radius * Math.sin(freq * time + phase + rotation);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(prevx, prevy, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(prevx, prevy);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    return { x, y };
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    const vx = epiCycles(width / 2, 150, 0, fourierX);
    const vy = epiCycles(150, height / 2, Math.PI / 2, fourierY);
    const v = { x: vx.x, y: vy.y };

    path.unshift(v);

    ctx.beginPath();
    ctx.moveTo(vx.x, vx.y);
    ctx.lineTo(v.x, v.y);
    ctx.moveTo(vy.x, vy.y);
    ctx.lineTo(v.x, v.y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.strokeStyle = '#f0f';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1;


    const dt = (2 * Math.PI) / fourierY.length / 2;
    time += dt;

    if (time > 2 * Math.PI) {
        time = 0;
        path.length = 0;
    }

    if (path.length > 250) {
        path.pop();
    }

    requestAnimationFrame(draw);
}

draw();
