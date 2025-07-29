document.addEventListener("DOMContentLoaded", function() {
    const formulaContainer = document.getElementById("formula-container");
    const formula = "\\int_a^b f(x) \\, dx = F(b) - F(a)";
    katex.render(formula, formulaContainer, {
        throwOnError: false
    });

    const mathElements = document.querySelectorAll(".math");
    mathElements.forEach(el => {
        const tex = el.textContent;
        katex.render(tex, el, {
            throwOnError: false
        });
    });
});
