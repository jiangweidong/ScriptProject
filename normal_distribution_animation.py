from manim import *
import numpy as np

class NormalDistributionAnimation(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[-4, 4, 1],
            y_range=[0, 0.5, 0.1],
            axis_config={"color": BLUE},
            x_axis_config={"numbers_to_include": np.arange(-4, 4.1, 2)},
            y_axis_config={"numbers_to_include": np.arange(0, 0.51, 0.1)},
        )
        labels = axes.get_axis_labels(x_label="x", y_label="f(x)")

        # Normal distribution curve
        graph = axes.plot(lambda x: np.exp(-x**2 / 2) / (np.sqrt(2 * PI)), color=WHITE)
        graph_label = axes.get_graph_label(graph, label='N(0,1)')

        self.play(Create(axes), Create(labels))
        self.play(Create(graph), Write(graph_label))
        self.wait(1)

        # Mean reversion simulation
        mean_line = axes.get_vertical_line(axes.c2p(0, 0.5), color=YELLOW)
        mean_label = Tex("Mean", color=YELLOW).next_to(mean_line, UP, buff=0.1)
        self.play(Create(mean_line), Write(mean_label))
        self.wait(1)

        # Create dots
        dots = VGroup(*[Dot(axes.c2p(np.random.uniform(-4, 4), 0), color=RED) for _ in range(50)])
        self.play(Create(dots))
        self.wait(1)

        # Animate dots moving towards the mean
        self.play(
            *[
                dot.animate.move_to(axes.c2p(np.random.normal(0, 0.5), 0))
                for dot in dots
            ],
            run_time=3
        )
        self.wait(2)
