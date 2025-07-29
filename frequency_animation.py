from manim import *

class FrequencyAnimation3D(ThreeDScene):
    def construct(self):
        # Create 3D axes
        axes = ThreeDAxes(
            x_range=[-2 * PI, 2 * PI, PI / 2],
            y_range=[-1.5, 1.5, 0.5],
            z_range=[-1.5, 1.5, 0.5],
            x_length=10,
            y_length=5,
            z_length=5,
            axis_config={"color": BLUE},
        )
        labels = axes.get_axis_labels(x_label="x", y_label="y", z_label="z")

        # Frequency and Z-shift trackers
        frequency = ValueTracker(1)
        z_shift = ValueTracker(0)

        # 3D Sine wave graph
        graph = always_redraw(
            lambda: axes.plot_parametric_curve(
                lambda t: np.array([
                    t,
                    np.sin(frequency.get_value() * t),
                    np.sin(t) * z_shift.get_value()
                ]),
                t_range=[-2 * PI, 2 * PI],
                color=YELLOW
            )
        )

        # Frequency label
        freq_label = always_redraw(
            lambda: MathTex(f"f = {frequency.get_value():.2f}").to_corner(UL)
        )

        self.set_camera_orientation(phi=75 * DEGREES, theta=30 * DEGREES)
        self.play(Create(axes), Create(labels))
        self.play(Create(graph), Write(freq_label))
        self.wait(1)

        # Animate frequency and camera
        self.play(frequency.animate.set_value(3), run_time=5, rate_func=linear)
        self.begin_ambient_camera_rotation(rate=0.1)
        self.wait(2)
        self.play(z_shift.animate.set_value(1), run_time=3)
        self.wait(2)
        self.play(frequency.animate.set_value(0.5), z_shift.animate.set_value(-1), run_time=5, rate_func=linear)
        self.wait(2)
        self.stop_ambient_camera_rotation()
