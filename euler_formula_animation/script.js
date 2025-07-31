const canvas = document.getElementById('complexPlane');
const ctx = canvas.getContext('2d');
const formulaDisplay = document.getElementById('formula-display');
const size = canvas.width;
const center = size / 2;
const radius = size / 3;

let theta = 0;

function drawAxes() {
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;

    // X-axis (Real)
    ctx.moveTo(0, center);
    ctx.lineTo(size, center);
    ctx.stroke();

    // Y-axis (Imaginary)
    ctx.moveTo(center, 0);
    ctx.lineTo(center, size);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#999';
    ctx.font = '16px sans-serif';
    ctx.fillText('Real', size - 50, center - 10);
    ctx.fillText('Imaginary', center + 10, 20);
}

function drawCircle() {
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    drawAxes();
    drawCircle();

    const x = center + radius * Math.cos(theta);
    const y = center - radius * Math.sin(theta); // Y is inverted in canvas

    // Vector e^{i\theta}
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 3;
    ctx.moveTo(center, center);
    ctx.lineTo(x, y);
    ctx.stroke();

    // cos(theta) line
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.moveTo(center, center);
    ctx.lineTo(x, center);
    ctx.stroke();

    // sin(theta) line
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.moveTo(x, center);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Dot on circle
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Update formula display
    const thetaDeg = (theta * 180 / Math.PI).toFixed(1);
    formulaDisplay.innerHTML = `
        When \\(\\theta = ${thetaDeg}^\\circ\\):<br>
        \\(e^{i${thetaDeg}^\\circ} = \\cos(${thetaDeg}^\\circ) + i\\sin(${thetaDeg}^\\circ)\\)<br>
        \\(\\cos(${thetaDeg}^\\circ) \\approx ${Math.cos(theta).toFixed(3)}\\)<br>
        \\(\\sin(${thetaDeg}^\\circ) \\approx ${Math.sin(theta).toFixed(3)}\\)
    `;
    MathJax.typesetPromise();
}

function animate() {
    theta += 0.01;
    if (theta > 2 * Math.PI) {
        theta = 0;
    }
    draw();
    requestAnimationFrame(animate);
}

animate();
