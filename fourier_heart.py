from manim import *
import numpy as np

class FourierHeartAccurate(Scene):
    def __init__(self, n_vectors=100, **kwargs):
        super().__init__(**kwargs)
        self.n_vectors = n_vectors
        self.center_point = ORIGIN

    def construct(self):
        self.camera.background_color = "#E2E2E2"
        
        # 1. Get points from the heart curve
        path = self.get_heart_path()
        path.set_color(BLACK).move_to(self.center_point)
        
        # 2. Calculate Fourier coefficients
        n_samples = 1000
        points = np.array([path.point_from_proportion(i / n_samples) for i in range(n_samples)])
        complex_points = points[:, 0] + 1j * points[:, 1]
        
        coeffs = np.fft.fft(complex_points) / n_samples
        
        # Sort coefficients by amplitude (magnitude)
        coeffs_sorted = sorted(enumerate(coeffs), key=lambda x: abs(x[1]), reverse=True)
        
        # Prepare frequencies, amplitudes, and phases
        freqs = [c[0] if c[0] <= n_samples / 2 else c[0] - n_samples for c in coeffs_sorted]
        amps = [abs(c[1]) for c in coeffs_sorted]
        phases = [np.angle(c[1]) for c in coeffs_sorted]

        # 3. Create the epicycle animation
        t_tracker = ValueTracker(0)
        
        def get_vectors(t):
            vectors = VGroup()
            start_point = self.center_point
            for i in range(self.n_vectors):
                freq = freqs[i]
                amp = amps[i]
                phase = phases[i]
                
                end_point = start_point + amp * np.array([
                    np.cos(2 * PI * freq * t + phase),
                    np.sin(2 * PI * freq * t + phase),
                    0
                ])
                
                vec = Line(start_point, end_point, stroke_width=2, color=BLUE)
                circle = Circle(radius=amp, color=GRAY, stroke_width=1, stroke_opacity=0.5).move_to(start_point)
                
                vectors.add(circle)
                vectors.add(vec)
                start_point = end_point
            
            vectors.add(Dot(start_point, color=RED))
            return vectors

        epicycles = always_redraw(lambda: get_vectors(t_tracker.get_value()))
        
        # 4. Trace the path
        drawn_path = TracedPath(lambda: epicycles[-1].get_center(), stroke_color=RED, stroke_width=3)
        
        title = Text("Accurate Fourier Series Heart", color=BLACK).to_edge(UP)
        self.add(title)
        self.play(Create(path), run_time=2)
        self.wait(0.5)
        
        self.play(FadeIn(epicycles))
        self.add(drawn_path)
        
        self.play(t_tracker.animate.set_value(1), run_time=15, rate_func=linear)
        
        self.wait(2)
        self.play(FadeOut(epicycles), FadeOut(drawn_path), FadeOut(path), FadeOut(title))
        self.wait(1)

    def get_heart_path(self):
        # Parametric function for a heart shape
        def heart_func(t):
            x = 16 * np.sin(t)**3
            y = 13 * np.cos(t) - 5 * np.cos(2*t) - 2 * np.cos(3*t) - np.cos(4*t)
            return np.array([x, y, 0]) / 10 # Scale down
            
        return ParametricFunction(heart_func, t_range=[0, TAU])
