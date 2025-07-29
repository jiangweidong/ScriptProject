import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Set up the figure and axis
fig, ax = plt.subplots(figsize=(8, 8))
ax.set_xlim(-20, 20)
ax.set_ylim(-20, 20)
ax.set_aspect('equal')
ax.grid(True)
ax.set_title('Animated Cartesian Heart Curve')
ax.set_xlabel('x')
ax.set_ylabel('y')

# Add the equations to the plot
equation_text = (
    r'$x(t) = 16\sin^3(t)$' '\n'
    r'$y(t) = 13\cos(t) - 5\cos(2t) - 2\cos(3t) - \cos(4t)$'
)
ax.text(0.05, 0.95, equation_text, transform=ax.transAxes, fontsize=12,
        verticalalignment='top', bbox=dict(boxstyle='round,pad=0.5', fc='wheat', alpha=0.5))

# The line object that will be updated
line, = ax.plot([], [], 'r-', lw=2)

# Set up the parameter t
t = np.linspace(0, 2 * np.pi, 200)
# Parametric equations for the heart curve
x = 16 * (np.sin(t)**3)
y = 13 * np.cos(t) - 5 * np.cos(2*t) - 2 * np.cos(3*t) - np.cos(4*t)

# Initialization function
def init():
    line.set_data([], [])
    return line,

# Animation function which updates the plot
def update(frame):
    # 'frame' will be an integer from 0 to len(t)-1
    line.set_data(x[:frame], y[:frame])
    return line,

# Create the animation
ani = FuncAnimation(fig, update, frames=len(t),
                    init_func=init, blit=True, interval=20)

# Display the plot
plt.show()
