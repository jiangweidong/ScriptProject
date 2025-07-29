from manim import *
import numpy as np

class NormalDistributionAnimation(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[-4, 4, 1],
            y_range=[0, 0.5, 0.1],
            axis_config={"color": BLUE},
            x_axis_config={"numbers_to_include": np.arange(-4, 4.1, 1)},
            y_axis_config={"numbers_to_include": np.arange(0, 0.51, 0.1)},
        )
        labels = axes.get_axis_labels(x_label="sigma", y_label="f(x)")
        self.play(Create(axes), Write(labels))

        # Normal distribution curve
        graph = axes.plot(lambda x: np.exp(-x**2 / 2) / (np.sqrt(2 * PI)), color=WHITE)
        graph_label = axes.get_graph_label(graph, label='N(0,1)')
        self.play(Create(graph), Write(graph_label))
        self.wait(1)

        # Show mean
        mean_line = axes.get_vertical_line(axes.c2p(0, axes.y_range[1]), color=YELLOW)
        mean_label = Text("Mean", color=YELLOW).next_to(mean_line, UP, buff=0.1)
        self.play(Create(mean_line), Write(mean_label))
        self.wait(1)

        # Show standard deviations
        std_devs = [-2, -1, 1, 2]
        std_lines = VGroup()
        std_labels = VGroup()
        for sd in std_devs:
            line = axes.get_vertical_line(axes.c2p(sd, axes.y_range[1]), color=GREEN, line_func=Line)
            label = Text(f"{sd} sigma", color=GREEN).next_to(line, UP, buff=0.1)
            std_lines.add(line)
            std_labels.add(label)
        
        self.play(Create(std_lines), Write(std_labels))
        self.wait(1)

        # Shade area for 1 standard deviation
        area = axes.get_area(graph, x_range=(-1, 1), color=ORANGE, opacity=0.5)
        area_label = Text("68.27%", color=ORANGE).move_to(axes.c2p(0, 0.15))
        self.play(FadeIn(area), Write(area_label))
        self.wait(1)

        # Mean reversion simulation
        title = Title("Mean Reversion Simulation")
        self.play(Write(title))

        # Create dots
        dots = VGroup(*[Dot(axes.c2p(np.random.uniform(-3.5, 3.5), 0), color=RED, radius=0.05) for _ in range(100)])
        self.play(Create(dots))
        self.wait(1)

        # Animate dots moving towards the mean
        self.play(
            *[
                dot.animate.move_to(axes.c2p(np.random.normal(0, 0.8), 0))
                for dot in dots
            ],
            run_time=4,
            rate_func=smooth
        )
        self.wait(2)
