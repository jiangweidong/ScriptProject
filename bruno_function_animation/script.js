const canvas = document.getElementById('brunoCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Bruno function approximation - not used in this version, but kept for reference
function bruno(x, iterations = 15) {
    let result = 0;
    let term = x;
    for (let i = 0; i < iterations; i++) {
        if (term < 1e-12) break;
        result += term;
        term *= term;
    }
    return result;
}

// --- Heart Curve Parameters ---
const scale = 18; // Scale factor for the heart shape

// Parametric equation for a heart shape
function heartX(t) {
    return scale * 16 * Math.pow(Math.sin(t), 3);
}

function heartY(t) {
    return -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
}

// --- Drawing ---
function drawHeart() {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(255, 0, 0, 0.7)';
    ctx.shadowBlur = 10;

    const steps = 2000; // More steps for a smoother curve
    const endStep = Math.floor(steps * animationProgress);

    for (let i = 0; i <= endStep; i++) {
        const t = (i / steps) * 2 * Math.PI;
        
        // Apply a function that oscillates to create a more "Bruno-like" fractal effect
        const r_factor = 1 + 0.1 * Math.sin(t * 30) + 0.05 * Math.sin(t * 60);

        const x = heartX(t) * r_factor;
        const y = heartY(t) * r_factor;

        // Center the heart on the canvas
        const screenX = width / 2 + x;
        const screenY = height / 2 + y;

        if (i === 0) {
            ctx.moveTo(screenX, screenY);
        } else {
            ctx.lineTo(screenX, screenY);
        }
    }
    ctx.stroke();
}


// --- Animation ---
let animationProgress = 0; // from 0 to 1
const animationSpeed = 0.002; // Slower speed for more detail

function drawFunction() { // Renamed to drawHeart for clarity
    drawHeart();
}

function animate() {
    // Slightly clear canvas to create a trailing effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    // Draw the function up to the current progress
    drawFunction();

    // Update progress
    if (animationProgress < 1) {
        animationProgress += animationSpeed;
    } else {
        animationProgress = 1; // Cap at 1
    }

    // Request next frame
    requestAnimationFrame(animate);
}

// Set a black background for the canvas
canvas.style.backgroundColor = '#000';

// Start the animation
animate();
