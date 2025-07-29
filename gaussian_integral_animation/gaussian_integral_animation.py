import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from scipy.stats import norm

# Create a figure and axis
fig, ax = plt.subplots(figsize=(10, 6))

# Set the x-axis limits
x_min, x_max = -4, 4
ax.set_xlim(x_min, x_max)
ax.set_ylim(0, 0.5)

# Create the x-values for the Gaussian curve
x = np.linspace(x_min, x_max, 1000)
# Calculate the y-values (Gaussian function)
y = norm.pdf(x, 0, 1)

# Plot the Gaussian curve
line, = ax.plot(x, y, 'r-', linewidth=2, label='Gaussian Function: $e^{-x^2}$')

# Add title and labels
ax.set_title("Gaussian Integral Animation")
ax.set_xlabel("x")
ax.set_ylabel("Probability Density")
ax.grid(True)

# Text element to display the integral value
integral_text = ax.text(0.05, 0.9, '', transform=ax.transAxes, fontsize=12)

# Fill element that will be updated
fill = None

# Initialization function for the animation
def init():
    global fill
    # Initial empty fill
    fill = ax.fill_between(x, y, where=[False]*len(x), color='skyblue', alpha=0.5)
    integral_text.set_text('')
    return fill, integral_text,

# Animation update function
def update(frame):
    global fill
    # frame will go from 0 to 100. Map it to the x-range
    integration_limit = x_min + (frame / 100) * (x_max - x_min)

    # Create a boolean mask for the fill area
    where_condition = (x >= x_min) & (x <= integration_limit)

    # Remove the old fill collection
    if fill:
        fill.remove()

    # Create the new fill
    fill = ax.fill_between(x, y, where=where_condition, color='skyblue', alpha=0.5, interpolate=True)

    # Calculate the integral value
    integral_value = norm.cdf(integration_limit) - norm.cdf(x_min)
    total_integral = norm.cdf(x_max) - norm.cdf(x_min) # Approximately 1
    integral_text.set_text(f'Integral from {x_min:.2f} to {integration_limit:.2f} = {integral_value:.4f} / {total_integral:.4f}')

    return fill, integral_text

# Create the animation
# We use 101 frames to go from x_min to x_max
ani = FuncAnimation(fig, update, frames=np.linspace(0, 100, 101),
                    init_func=init, blit=True, interval=50, repeat=False)

# Add a legend
ax.legend([line], [r'Gaussian Curve $f(x) = \frac{1}{\sqrt{2\pi}} e^{-x^2/2}$'])

# To save the animation, you need a writer like ffmpeg
# ani.save('gaussian_integral.gif', writer='imagemagick', fps=20)
# ani.save('gaussian_integral.mp4', writer='ffmpeg', fps=20)

plt.show()
