const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numPoints = 10000;
const points = [];

for (let i = 0; i < numPoints; i++) {
    const x = (i % 100) * 0.1;
    const y = Math.floor(i / 100) * 0.1;
    points.push({ x, y });
}

let t = 0;

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const x = p.x;
        const y = p.y;

        const k = (4 + Math.cos(y)) * Math.cos(x / 4);
        const e = y / 8 - 20;
        const d = Math.sqrt(k * k + e * e);
        const c = d - t;
        const q = Math.sin(3 * k) + Math.sin(y / 19 + 9) * k * (6 + Math.sin(14 * e - d));

        const px = q * Math.cos(d / 8 + t / 4) + 50 * Math.cos(c) + canvas.width / 2;
        const py = q * Math.sin(c) + 7 * d * Math.sin(c / 4) + canvas.height / 2;
        
        const hue = (d * 10 + t * 50) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

        ctx.beginPath();
        ctx.arc(px, py, 1, 0, 2 * Math.PI);
        ctx.fill();
    }

    t += 0.01;
    requestAnimationFrame(animate);
}

animate();
