const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const functionSelect = document.getElementById('function-select');
const functionDisplay = document.getElementById('function-display');
const resetButton = document.getElementById('reset-button');
const pauseButton = document.getElementById('pause-button');


// --- Configuration ---
const gridSize = 20;
const animationSpeed = 0.01;
let t = 0; // Interpolation parameter from 0 to 1
let isPaused = false;
let currentFunction = 'z_squared';

// Complex number class for easier calculations
class Complex {
    constructor(re, im) {
        this.re = re;
        this.im = im;
    }

    add(other) {
        return new Complex(this.re + other.re, this.im + other.im);
    }

    multiply(other) {
        const re = this.re * other.re - this.im * other.im;
        const im = this.re * other.im + this.im * other.re;
        return new Complex(re, im);
    }

    exp() {
        const expRe = Math.exp(this.re);
        const re = expRe * Math.cos(this.im);
        const im = expRe * Math.sin(this.im);
        return new Complex(re, im);
    }

    sin() {
        const re = Math.sin(this.re) * Math.cosh(this.im);
        const im = Math.cos(this.re) * Math.sinh(this.im);
        return new Complex(re, im);
    }

    static lerp(a, b, t) {
        const re = (1 - t) * a.re + t * b.re;
        const im = (1 - t) * a.im + t * b.im;
        return new Complex(re, im);
    }
}

// --- The Complex Functions ---
const functions = {
    'z_squared': {
        func: z => z.multiply(z),
        name: 'f(z) = z^2'
    },
    'exp_z': {
        func: z => z.exp(),
        name: 'f(z) = e^z'
    },
    'sin_z': {
        func: z => z.sin(),
        name: 'f(z) = sin(z)'
    },
    'z_cubed': {
        func: z => z.multiply(z).multiply(z),
        name: 'f(z) = z^3'
    }
};

function f(z) {
    return functions[currentFunction].func(z);
}

// --- Coordinate Transformation ---
function toComplex(x, y) {
    const re = (x - width / 2) / (width / 4);
    const im = (height / 2 - y) / (height / 4);
    return new Complex(re, im);
}

function toCanvas(z) {
    const x = z.re * (width / 4) + width / 2;
    const y = height / 2 - z.im * (height / 4);
    return { x, y };
}

// --- Drawing Functions ---
function drawGrid(transformFunc) {
    const stepX = width / (2 * gridSize);
    const stepY = height / (2 * gridSize);

    for (let i = -gridSize; i < gridSize; i++) {
        for (let j = -gridSize; j < gridSize; j++) {
            const z1 = toComplex(i * stepX + width / 2, j * stepY + height / 2);
            const z2 = toComplex((i + 1) * stepX + width / 2, j * stepY + height / 2);
            const z3 = toComplex((i + 1) * stepX + width / 2, (j + 1) * stepY + height / 2);
            const z4 = toComplex(i * stepX + width / 2, (j + 1) * stepY + height / 2);

            const tz1 = transformFunc(z1);
            const tz2 = transformFunc(z2);
            const tz3 = transformFunc(z3);
            const tz4 = transformFunc(z4);

            const p1 = toCanvas(tz1);
            const p2 = toCanvas(tz2);
            const p3 = toCanvas(tz3);
            const p4 = toCanvas(tz4);

            // Color based on argument of the center of the original cell
            const centerX = (i + 0.5) * stepX + width / 2;
            const centerY = (j + 0.5) * stepY + height / 2;
            const centerZ = toComplex(centerX, centerY);
            const angle = (Math.atan2(centerZ.im, centerZ.re) + Math.PI) / (2 * Math.PI);
            const hue = angle * 360;

            ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
            ctx.strokeStyle = `hsl(${hue}, 80%, 50%)`;
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.lineTo(p4.x, p4.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
}


// --- Animation Loop ---
function animate() {
    if (!isPaused) {
        ctx.clearRect(0, 0, width, height);

        // Draw the transformed grid
        drawGrid(z => {
            const fz = f(z);
            return Complex.lerp(z, fz, t);
        });

        // Update the interpolation parameter
        t += animationSpeed;
        if (t > 1) {
            t = 1;
        }
    }
    requestAnimationFrame(animate);
}

// --- Event Listeners ---
functionSelect.addEventListener('change', (e) => {
    currentFunction = e.target.value;
    functionDisplay.textContent = functions[currentFunction].name;
    t = 0;
});

resetButton.addEventListener('click', () => {
    t = 0;
});

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Play' : 'Pause';
});


// Start the animation
animate();
