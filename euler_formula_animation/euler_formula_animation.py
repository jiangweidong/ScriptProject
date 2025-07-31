from manim import *

class EulersFormulaAnimation(Scene):
    def construct(self):
        # Title
        title = Title("Euler's Formula: $e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)$")
        self.play(Write(title))

        # Complex plane
        axes = ComplexPlane().add_coordinates()
        self.play(Create(axes))

        # Circle
        circle = Circle(radius=1, color=BLUE)
        self.play(Create(circle))

        # Dot on the circle
        dot = Dot(axes.n2p(1), color=YELLOW)
        
        # Line from origin to dot
        line = Line(axes.n2p(0), axes.n2p(1), color=YELLOW)

        # Angle tracker
        theta = ValueTracker(0)

        # Labels
        label = MathTex("e^{i\\theta}", color=YELLOW).add_updater(
            lambda m: m.next_to(dot.get_center(), UR, buff=0.1)
        )
        cos_label = MathTex("\\cos(\\theta)", color=RED).add_updater(
            lambda m: m.next_to(cos_line, DOWN)
        )
        sin_label = MathTex("i\\sin(\\theta)", color=GREEN).add_updater(
            lambda m: m.next_to(sin_line, LEFT, buff=0.1)
        )
        
        # Lines for cos and sin
        cos_line = Line(axes.n2p(0), axes.n2p(1), color=RED).add_updater(
            lambda m: m.put_start_and_end_on(axes.n2p(0), axes.n2p(np.cos(theta.get_value())))
        )
        # The original code had a bug where sin_line was initialized as a zero-length line
        # when theta=0, which caused a crash. Initializing it as a non-zero length line fixes this.
        sin_line = Line(axes.n2p(1), axes.n2p(1+0.001j), color=GREEN).add_updater(
            lambda m: m.put_start_and_end_on(axes.n2p(np.cos(theta.get_value())), dot.get_center())
        )
        
        self.play(Create(dot), Create(line), Write(label))
        self.play(Create(cos_line), Create(sin_line), Write(cos_label), Write(sin_label))

        # Animate
        dot.add_updater(
            lambda d: d.move_to(axes.n2p(np.exp(1j * theta.get_value())))
        )
        line.add_updater(
            lambda l: l.put_start_and_end_on(axes.n2p(0), dot.get_center())
        )
        
        self.play(theta.animate.set_value(2 * PI), run_time=6, rate_func=linear)
        
        # Show for theta = pi
        pi_val = PI
        pi_formula = MathTex("e^{i\\pi} = \\cos(\\pi) + i\\sin(\\pi) = -1", font_size=48).to_edge(DOWN)
        
        self.play(theta.animate.set_value(pi_val), run_time=2)
        self.play(Write(pi_formula))

        self.wait(3)
