import numpy as np
import matplotlib.pyplot as plt
from celluloid import Camera
from scipy.stats import norm

# Setup the plot
fig, ax = plt.subplots()
camera = Camera(fig)
ax.set_xlim(-4, 4)
ax.set_ylim(0, 0.5)
ax.set_xlabel("Value")
ax.set_ylabel("Probability Density")
ax.set_title("Normal Distribution and Mean Reversion")

# Plot the normal distribution
x = np.linspace(-4, 4, 1000)
y = norm.pdf(x, 0, 1)
ax.plot(x, y, 'b-')

# Generate initial random data
data = np.random.uniform(-4, 4, 50)

# Animate the mean reversion
for i in range(100):
    # Plot the current state of the data
    ax.plot(data, np.zeros_like(data), 'ro', markersize=5)
    
    # Add text for the current frame
    ax.text(0.05, 0.95, f"Frame: {i+1}", transform=ax.transAxes, ha="left", va="top")
    
    # Capture the frame
    camera.snap()
    
    # Move data towards the mean
    data = data * 0.95 + np.random.normal(0, 0.1, 50)

# Create the animation
animation = camera.animate()
animation.save('mean_reversion.gif', writer='imagemagick')

plt.close()
