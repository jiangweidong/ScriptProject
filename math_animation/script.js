const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numPoints = 10000;
const points = [];

for (let i = 0; i < numPoints; i++) {
    const x_i = i % 200;
    const y_i = i / 55;
    const k_i = 9 * Math.cos(x_i / 8);
    const e_i = y_i / 8 - 12.5;
    points.push({ k_i, e_i });
}

let t = 0;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numPoints; i++) {
        const { k_i, e_i } = points[i];

        const d_i = (k_i * k_i + e_i * e_i) / 99 + Math.sin(t) / 6 + 0.5;
        const q_i = 99 - (e_i * Math.sin(7 * Math.atan2(k_i, e_i))) / d_i + k_i * (3 + 2 * Math.cos(d_i * d_i - t));
        const c_i = d_i / 2 + e_i / 69 - t / 16;

        const x_plot = q_i * Math.sin(c_i) + canvas.width / 2;
        const y_plot = (q_i + 19 * d_i) * Math.cos(c_i) + canvas.height / 2;

        const colorIndex = (Math.atan2(k_i, e_i) + t) % 1;
        const hue = colorIndex * 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

        ctx.beginPath();
        ctx.arc(x_plot, y_plot, 1, 0, 2 * Math.PI);
        ctx.fill();
    }

    t += Math.PI / 120;
    requestAnimationFrame(animate);
}

animate();
