from manim import *

class NewtonLeibniz(Scene):
    def construct(self):
        # Title
        title = Tex("Newton-Leibniz Formula", font_size=48).to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        # Axes and function
        axes = Axes(
            x_range=[-1, 5, 1],
            y_range=[-1, 7, 1],
            axis_config={"color": BLUE},
        ).add_coordinates()
        
        graph = axes.plot(lambda x: 0.5 * x**2, color=YELLOW)
        graph_lab = axes.get_graph_label(graph, label='f(x) = 0.5x^2')

        self.play(Create(axes), Create(graph), Write(graph_lab))
        self.wait(1)

        # Integral
        riemann_rects = axes.get_riemann_rectangles(graph, x_range=[1, 4], dx=0.1, color=GREEN)
        
        integral_text = MathTex(r"\int_{a}^{b} f(x) \,dx", font_size=48).next_to(axes, DOWN, buff=0.5)
        self.play(Write(integral_text))
        self.play(Create(riemann_rects))
        self.wait(2)

        # Formula
        formula = MathTex(r"\int_{a}^{b} f(x) \,dx = F(b) - F(a)", font_size=48).move_to(integral_text.get_center())
        
        a_val = 1
        b_val = 4
        
        a_dot = Dot(axes.c2p(a_val, 0), color=RED)
        b_dot = Dot(axes.c2p(b_val, 0), color=RED)
        a_lab = MathTex("a").next_to(a_dot, DOWN)
        b_lab = MathTex("b").next_to(b_dot, DOWN)

        self.play(Transform(integral_text, formula), FadeOut(riemann_rects))
        self.play(Create(a_dot), Create(b_dot), Write(a_lab), Write(b_lab))
        self.wait(2)

        # Antiderivative
        antiderivative_text = MathTex(r"F(x) = \int f(x) \,dx = \frac{1}{6}x^3", font_size=48).next_to(title, DOWN, buff=1)
        self.play(Write(antiderivative_text))
        self.wait(2)

        # Calculation
        calculation = MathTex(
            r"F(b) - F(a) = F(4) - F(1)",
            r"= \frac{1}{6}(4)^3 - \frac{1}{6}(1)^3",
            r"= \frac{64}{6} - \frac{1}{6}",
            r"= \frac{63}{6} = 10.5",
            font_size=48
        ).next_to(integral_text, DOWN, buff=0.5).shift(LEFT*2)
        
        self.play(FadeOut(a_dot, b_dot, a_lab, b_lab))
        self.play(Transform(integral_text, calculation[0]))
        self.wait(1)
        for i in range(1, len(calculation)):
            self.play(Transform(integral_text, calculation[i]))
            self.wait(1)

        # Show area again
        area = axes.get_area(graph, x_range=[1, 4], color=GREEN, opacity=0.5)
        result_text = MathTex(r"\int_{1}^{4} 0.5x^2 \,dx = 10.5", font_size=48).move_to(integral_text.get_center())
        
        self.play(FadeOut(integral_text), FadeOut(antiderivative_text))
        self.play(Create(area), Write(result_text))
        self.wait(3)
