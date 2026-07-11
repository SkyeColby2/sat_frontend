// SAT Desmos Mastery Course - Question Bank and Lessons Data

const CURRICULUM_DATA = [
    {
        id: "module-1",
        title: "Module 1: Systems of Equations",
        topics: [
            {
                id: "sys-eq-1",
                title: "Standard Systems (Intersection)",
                difficulty: "Medium",
                content: `
                    <h1>Systems of Equations: Graph & Intersect</h1>
                    <p>In the digital SAT, you will frequently encounter pairs of equations. Rather than doing time-consuming substitution or elimination by hand, you can plot them in Desmos and identify their intersections immediately.</p>
                    
                    <div class="strategy-box">
                        <h4><i class="fa-solid fa-crosshairs"></i> The Strategy</h4>
                        <ol>
                            <li>Type the first equation on Line 1.</li>
                            <li>Type the second equation on Line 2.</li>
                            <li>Look at the coordinate grid and click on the intersection point. Desmos will highlight it and display the coordinates (<i>x</i>, <i>y</i>).</li>
                        </ol>
                    </div>

                    <div class="tip-box">
                        <h4><i class="fa-solid fa-triangle-exclamation"></i> Watch out for the prompt!</h4>
                        <p>Always verify what the question is asking. If it asks for the value of <i>y</i>, make sure you take the second number in the coordinate pair (<i>x</i>, <i>y</i>). If it asks for <i>x</i> + <i>y</i>, calculate it using the values from Desmos.</p>
                    </div>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>Consider the system of linear equations:</p>
                        <pre>-x + y = -3.5<br>x + 3y = 9.5</pre>
                        <p>If (<i>x</i>, <i>y</i>) satisfies the system of equations above, what is the value of <i>y</i>?</p>
                    `,
                    answer: "1.5",
                    desmosHint: "Enter both equations on separate lines in the Desmos panel. Zoom in/out, and click on the gray dot at the intersection point. The coordinate is (5, 1.5). Since the question asks for <i>y</i>, the answer is 1.5.",
                    desmosPreset: ["-x + y = -3.5", "x + 3y = 9.5"],
                    validationType: "sys-eq"
                }
            },
            {
                id: "sys-eq-2",
                title: "Systems with Quadratics",
                difficulty: "Medium",
                content: `
                    <h1>Linear-Quadratic Systems</h1>
                    <p>SAT questions often feature a system containing a linear equation and a quadratic equation, asking you to find a possible solution value. Desmos excels here because it bypasses algebraic factoring and quadratic formulas entirely.</p>
                    
                    <div class="strategy-box">
                        <h4><i class="fa-solid fa-calculator"></i> Desmos Advantage</h4>
                        <p>When you graph a line and a parabola, they can intersect in 0, 1, or 2 points. Desmos plots both shapes and highlights all intersection points with clickable gray dots. You can immediately see all possible solutions.</p>
                    </div>
                `,
                question: {
                    type: "mcq",
                    difficulty: "Medium",
                    text: `
                        <p>Consider the system of equations:</p>
                        <pre>y = x + 1<br>y = x² + x</pre>
                        <p>If (<i>x</i>, <i>y</i>) is a solution to the system of equations above, which of the following could be the value of <i>x</i>?</p>
                    `,
                    options: [
                        { letter: "A", text: "-1" },
                        { letter: "B", text: "0" },
                        { letter: "C", text: "2" },
                        { letter: "D", text: "3" }
                    ],
                    answer: "A",
                    desmosHint: "Plot <code>y = x + 1</code> and <code>y = x^2 + x</code>. You will see two intersection points at (-1, 0) and (1, 2). The possible <i>x</i>-values are -1 and 1. Looking at the choices, -1 is Option A.",
                    desmosPreset: ["y = x + 1", "y = x^2 + x"],
                    validationType: "sys-eq-quad"
                }
            },
            {
                id: "sys-eq-3",
                title: "Advanced Systems (Expression Solver)",
                difficulty: "Hard",
                content: `
                    <h1>Direct Expression Solver</h1>
                    <p>Standard Desmos graphing is perfect for finding the individual values of <i>x</i> and <i>y</i>. But what if the SAT asks you to find the value of a combined expression, like 8<i>x</i> + 7<i>y</i> or 3<i>x</i> + 3<i>y</i>?</p>
                    <p>Desmos has a secret weapon: <strong>List Regressions</strong>. We can feed multiple equations into a single regression line, solving for variables and evaluating expressions in a single step to prevent arithmetic errors.</p>
                    
                    <div class="syntax-card">
                        <h4><i class="fa-solid fa-code"></i> List Regression Syntax</h4>
                        <p>Instead of writing separate lines, combine equations inside brackets and use the regression operator <code>~</code>:</p>
                        <pre>[ eq1_left, eq2_left ] ~ [ eq1_right, eq2_right ]</pre>
                        <p><em>Example:</em> For 2<i>x</i> + 3<i>y</i> = 8 and <i>x</i> - <i>y</i> = 5, you write:</p>
                        <pre>[ 2*x1 + 3*y1, x1 - y1 ] ~ [ 8, 5 ]</pre>
                        <p>Desmos will automatically calculate the regression parameters <code>x1</code> and <code>y1</code>. You can then evaluate any expression, e.g., <code>x1 + y1</code> on the next line!</p>
                    </div>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>Consider the system of equations:</p>
                        <pre>7x - 5y = 4<br>4x - 8y = 9</pre>
                        <p>If (<i>x</i>, <i>y</i>) is the solution to the system of equations above, what is the value of 3<i>x</i> + 3<i>y</i>?</p>
                    `,
                    answer: "-5",
                    desmosHint: "Enter list regression to solve: <code>[7*x1 - 5*y1, 4*x1 - 8*y1] ~ [4, 9]</code>. Once Desmos solves for <code>x1</code> and <code>y1</code>, type <code>3*x1 + 3*y1</code> on line 2. Desmos will output <code>-5</code>.",
                    desmosPreset: ["[7*x1 - 5*y1, 4*x1 - 8*y1] ~ [4, 9]", "3*x1 + 3*y1"],
                    validationType: "list-regression"
                }
            }
        ]
    },
    {
        id: "module-2",
        title: "Module 2: Lines & Polynomials",
        topics: [
            {
                id: "poly-1",
                title: "Finding Vertices (Max/Min)",
                difficulty: "Medium",
                content: `
                    <h1>Analyzing Parabolas: Vertices</h1>
                    <p>Anytime an SAT math question asks you to find a <strong>maximum</strong>, <strong>minimum</strong>, or <strong>y-intercept</strong> of a quadratic function, do not waste time completing the square. Put it directly into Desmos!</p>
                    
                    <div class="strategy-box">
                        <h4><i class="fa-solid fa-bullseye"></i> Output vs. Input Location</h4>
                        <ul>
                            <li><strong>Minimum/Maximum value:</strong> This refers to the output (<i>y</i>-value) at the vertex.</li>
                            <li><strong>Value of <i>x</i> where it occurs:</strong> This refers to the input (<i>x</i>-value) at the vertex.</li>
                        </ul>
                        <p>When you click on the vertex of a parabola in Desmos, it shows the coordinate (<i>h</i>, <i>k</i>). The <i>h</i> is the <i>x</i>-value where the max/min occurs; the <i>k</i> is the max/min value itself.</p>
                    </div>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>Let the function <i>f</i> be defined by:</p>
                        <pre>f(x) = x² - 48x + 2,304</pre>
                        <p>What is the minimum value of the given function?</p>
                    `,
                    answer: "1728",
                    desmosHint: "Type <code>y = x^2 - 48*x + 2304</code>. The graph will be off the screen, so zoom out or click the wrench icon to change the Y-axis range to [1000, 2500]. Click the vertex dot at (24, 1728). The minimum value is the y-coordinate, which is 1728.",
                    desmosPreset: ["y = x^2 - 48*x + 2304"],
                    validationType: "vertex"
                }
            },
            {
                id: "poly-2",
                title: "Shifted Polynomials",
                difficulty: "Medium",
                content: `
                    <h1>Shifted Equations & Graphing</h1>
                    <p>Some questions present equations with function shifts, e.g., <i>p</i>(<i>x</i>) + <i>c</i> = <i>x</i>². To find the vertex or properties of <i>p</i>(<i>x</i>), rearrange the equation so <i>y</i> = <i>p</i>(<i>x</i>) is by itself, then graph it.</p>
                    
                    <div class="strategy-box">
                        <h4><i class="fa-solid fa-arrow-right-left"></i> Algebraic Rearrangement Shortcut</h4>
                        <p>If you see <i>p</i>(<i>x</i>) + 57 = <i>x</i>², subtract 57 to get <i>p</i>(<i>x</i>) = <i>x</i>² - 57. Plot <i>y</i> = <i>x</i>² - 57 in Desmos and observe its characteristics immediately.</p>
                    </div>
                `,
                question: {
                    type: "mcq",
                    difficulty: "Medium",
                    text: `
                        <p>The given equation relates the value of <i>x</i> and its corresponding value of <i>p</i>(<i>x</i>) for the function <i>p</i>:</p>
                        <pre>p(x) + 57 = x²</pre>
                        <p>What is the minimum value of the function <i>p</i>?</p>
                    `,
                    options: [
                        { letter: "A", text: "-3,249" },
                        { letter: "B", text: "-57" },
                        { letter: "C", text: "57" },
                        { letter: "D", text: "3,249" }
                    ],
                    answer: "B",
                    desmosHint: "Rewrite as <code>y = x^2 - 57</code>. Click on the vertex. The coordinate is (0, -57). The minimum value of the function is the y-value: -57. Option B is correct.",
                    desmosPreset: ["y = x^2 - 57"],
                    validationType: "vertex"
                }
            },
            {
                id: "poly-3",
                title: "y-Intercepts of Exponentials",
                difficulty: "Medium",
                content: `
                    <h1>Exponential Intercepts</h1>
                    <p>Exponential functions can look intimidating, especially with fractional bases or negative coefficients. Desmos strips away the complexity by drawing the curve instantly. The y-intercept is always where the graph crosses the vertical axis (<i>x</i> = 0).</p>
                `,
                question: {
                    type: "mcq",
                    difficulty: "Hard",
                    text: `
                        <p>The function <i>f</i> is defined by <i>f</i>(<i>x</i>) = (-8)(2)<sup>x</sup> + 22. What is the y-intercept of the graph of <i>y</i> = <i>f</i>(<i>x</i>) in the <i>xy</i>-plane?</p>
                    `,
                    options: [
                        { letter: "A", text: "(0, 14)" },
                        { letter: "B", text: "(0, 2)" },
                        { letter: "C", text: "(0, 22)" },
                        { letter: "D", text: "(0, -8)" }
                    ],
                    answer: "A",
                    desmosHint: "Enter <code>y = -8 * (2)^x + 22</code>. Look at the y-axis and click the intercept point. It highlights (0, 14). Thus, Option A is the correct answer.",
                    desmosPreset: ["y = -8 * (2)^x + 22"],
                    validationType: "intercept"
                }
            }
        ]
    },
    {
        id: "module-3",
        title: "Module 3: Using Sliders",
        topics: [
            {
                id: "slider-1",
                title: "One-Sided Shifting & Sliders",
                difficulty: "Hard",
                content: `
                    <h1>The Power of Variable Sliders</h1>
                    <p>When an SAT question contains an additional variable like <i>a</i>, <i>b</i>, <i>c</i>, <i>k</i>, <i>n</i>, Desmos sliders are incredibly useful. This strategy is especially powerful when a question asks "what value of <i>k</i> makes the equation have exactly 1 solution?"</p>
                    
                    <div class="strategy-box">
                        <h4><i class="fa-solid fa-sliders"></i> Slider Strategy</h4>
                        <ol>
                            <li>Move all terms of the equation to one side to get <i>F</i>(<i>x</i>, <i>k</i>) = 0.</li>
                            <li>Type the expression in Desmos: <code>y = F(x, k)</code>.</li>
                            <li>Desmos will offer a prompt to "add slider: <i>k</i>". Click on <strong>k</strong>.</li>
                            <li>Move the slider or type values for <i>k</i> until you see exactly the number of solutions required (represented by intersections with the x-axis, i.e., <i>y</i> = 0).</li>
                        </ol>
                    </div>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>In the given equation, <i>k</i> is a constant:</p>
                        <pre>√(k - x) = 58 - x</pre>
                        <p>The equation has exactly one real solution. What is the minimum possible value of 4<i>k</i>?</p>
                    `,
                    answer: "231",
                    desmosHint: "Move everything to one side: <code>58 - x - sqrt(k - x)</code>. In Desmos, type <code>y = 58 - x - sqrt(k - x)</code>. Add a slider for <code>k</code>. Drag the slider or adjust its limits to find where the graph touches the x-axis exactly once (at the vertex). You will find this occurs when <code>k = 57.75</code>. The question asks for 4<i>k</i>, so calculate 4 * 57.75 = 231.",
                    desmosPreset: ["y = 58 - x - sqrt(k - x)", "k = 57.75", "4 * k"],
                    validationType: "slider-single-sol"
                }
            },
            {
                id: "slider-2",
                title: "Parabola & Line Intersections",
                difficulty: "Hard",
                content: `
                    <h1>Parabola & Line Contact</h1>
                    <p>If a question says "a line 2<i>y</i> = <i>c</i> intersects a parabola at exactly one point", it means the line is tangent to the parabola (touching its vertex). Let's use a slider to find this tangency height.</p>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>In the <i>xy</i>-plane, a line with equation 2<i>y</i> = <i>c</i> for some constant <i>c</i> intersects a parabola at exactly one point. If the parabola has equation <i>y</i> = -2<i>x</i>² + 9<i>x</i>, what is the value of <i>c</i>?</p>
                    `,
                    answer: "20.25",
                    desmosHint: "Plot <code>y = -2*x^2 + 9*x</code> and the horizontal line <code>y = c/2</code>. Add a slider for <code>c</code>. Slide <code>c</code> until the line touches the vertex of the parabola. The vertex is at (2.25, 10.125). So <i>c</i>/2 = 10.125 \\implies <i>c</i> = 20.25.",
                    desmosPreset: ["y = -2*x^2 + 9*x", "y = c/2", "c = 20.25"],
                    validationType: "slider"
                }
            },
            {
                id: "slider-3",
                title: "Quadratic Constraints (No Solution)",
                difficulty: "Hard",
                content: `
                    <h1>Inequalities & No Real Solution</h1>
                    <p>When a quadratic equation has "no real solution," the graph of the parabola does not cross the x-axis. We can use a slider for the unknown coefficient and adjust it until the parabola hovers completely above or below the axis.</p>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>Consider the quadratic equation:</p>
                        <pre>-x² + bx - 676 = 0</pre>
                        <p>In the given equation, <i>b</i> is a positive integer. The equation has no real solution. What is the greatest possible value of <i>b</i>?</p>
                    `,
                    answer: "51",
                    desmosHint: "Type <code>y = -x^2 + b*x - 676</code> and add a slider for <code>b</code>. Set the slider range from 0 to 100. Slide <code>b</code> and observe the graph. For the equation to have no real solution, the parabola must be completely below the x-axis (<i>y</i> < 0). At <code>b = 52</code>, the vertex touches the x-axis. Thus, for no solution, we need <i>b</i> < 52. Since <i>b</i> is a positive integer, the greatest possible value is 51.",
                    desmosPreset: ["y = -x^2 + b*x - 676", "b = 51"],
                    validationType: "slider"
                }
            }
        ]
    },
    {
        id: "module-4",
        title: "Module 4: Regressions & Custom Models",
        topics: [
            {
                id: "reg-1",
                title: "Table Fitting & Regressions",
                difficulty: "Hard",
                content: `
                    <h1>Regressions: Fitting Curves to Points</h1>
                    <p>What is a regression? It is a method of finding the relationship between variables. When the SAT provides a graph containing points or a table of coordinates, you can use Desmos to calculate the missing coefficients instantly.</p>
                    
                    <div class="strategy-box">
                        <h4><i class="fa-solid fa-table"></i> Regression Procedure</h4>
                        <ol>
                            <li>Click the **+ Table** button to insert a table with columns <i>x</i>₁ and <i>y</i>₁.</li>
                            <li>Type your coordinates into the table.</li>
                            <li>Underneath the table, enter the general formula of the curve using the tilde symbol <code>~</code> instead of <code>=</code>, and reference <code>x1</code> and <code>y1</code>.</li>
                            <li>For a quadratic <i>y</i> = 2<i>x</i>² + <i>bx</i> + <i>c</i>, enter: <code>y1 ~ 2*x1^2 + b*x1 + c</code>.</li>
                        </ol>
                    </div>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>The graph of <i>y</i> = 2<i>x</i>² + <i>bx</i> + <i>c</i> passes through the points (-2, -6), (-1, -8), and (0, -6), where <i>b</i> and <i>c</i> are constants. What is the value of <i>bc</i>?</p>
                    `,
                    answer: "-24",
                    desmosHint: "Click '+ Table' in Desmos and enter the points: (-2,-6), (-1,-8), and (0,-6) in columns <i>x</i>₁ and <i>y</i>₁. On Line 2, type the regression: <code>y1 ~ 2*x1^2 + b*x1 + c</code>. Desmos solves: <code>b = 4</code> and <code>c = -6</code>. The product <i>bc</i> = 4 * (-6) = -24.",
                    desmosPreset: ["table:[-2,-1,0]:[-6,-8,-6]", "y1 ~ 2*x1^2 + b*x1 + c", "b * c"],
                    validationType: "table-regression"
                }
            },
            {
                id: "reg-2",
                title: "Custom Exponential Regressions",
                difficulty: "Hard",
                content: `
                    <h1>Custom Regressions</h1>
                    <p>Desmos's built-in regression dropdown is very limited. However, you can write any mathematical expression you want on the right side of the tilde symbol, making it easy to fit complex exponential or rational models.</p>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>The function <i>h</i> is defined by <i>h</i>(<i>x</i>) = <i>a</i><sup>x</sup> + <i>b</i>, where <i>a</i> and <i>b</i> are positive constants. The graph of <i>y</i> = <i>h</i>(<i>x</i>) in the <i>xy</i>-plane passes through the points (0, 10) and (-2, 325/36). What is the value of <i>ab</i>?</p>
                    `,
                    answer: "54",
                    desmosHint: "Create a table with points (0,10) and (-2, 325/36). Fit with regression: <code>y1 ~ a^x1 + b</code>. Desmos will calculate <code>a = 6</code> and <code>b = 9</code>. Compute the product: <i>ab</i> = 6 * 9 = 54.",
                    desmosPreset: ["table:[0,-2]:[10, 325/36]", "y1 ~ a^x1 + b", "a * b"],
                    validationType: "table-regression"
                }
            },
            {
                id: "reg-3",
                title: "Regressions with Constraints",
                difficulty: "Hard",
                content: `
                    <h1>Regressions with Explicit Constraints</h1>
                    <p>Sometimes, the SAT gives you coordinates plus a verbal constraint, such as "the product of <i>a</i> and <i>b</i> is 65/7." To handle this, solve the constraint for one variable (e.g., <i>a</i> = 65/(7<i>b</i>)) and input it directly into your regression. Desmos will fit the model while respecting the constraint!</p>
                    
                    <div class="tip-box">
                        <h4><i class="fa-solid fa-exclamation-triangle"></i> Constraint Formatting Rule</h4>
                        <p>Constraints must be defined **explicitly**. The isolated variable must be alone on the left-hand side. Instead of <code>a*b = 65/7</code>, write <code>a = 65 / (7*b)</code>.</p>
                    </div>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>A function <i>f</i> is defined by <i>f</i>(<i>x</i>) = -<i>a</i><sup>x</sup> + <i>b</i>, where <i>a</i> and <i>b</i> are constants. In the <i>xy</i>-plane, the graph of <i>y</i> = <i>f</i>(<i>x</i>) - 15 has a y-intercept at (0, -99/7). The product of <i>a</i> and <i>b</i> is 65/7. What is the value of <i>a</i>?</p>
                    `,
                    answer: "5",
                    desmosHint: "1) Create a table with y-intercept point (0, -99/7). 2) Type the regression matching the shifted function: <code>y1 ~ f(x1) - 15</code>. 3) Define the function: <code>f(x) = -a^x + b</code>. 4) Define the constraint: <code>a = 65 / (7*b)</code>. Desmos calculates <code>a = 5</code>.",
                    desmosPreset: ["table:[0]:[-99/7]", "y1 ~ f(x1) - 15", "f(x) = -a^x + b", "a = 65 / (7*b)"],
                    validationType: "constrained-regression"
                }
            }
        ]
    },
    {
        id: "module-5",
        title: "Module 5: The 'Random' Variable Trick",
        topics: [
            {
                id: "rand-1",
                title: "Equivalent Expressions",
                difficulty: "Hard",
                content: `
                    <h1>Bypassing Algebra with 'random'</h1>
                    <p>SAT questions frequently ask you to identify equivalent algebraic expressions. When the formulas contain multiple variables or complex expansions, you can test equivalence numerically for 100 random values using the <code>random()</code> function.</p>
                    
                    <div class="strategy-box">
                        <h4><i class="fa-solid fa-dice"></i> The 'random' Strategy</h4>
                        <ol>
                            <li>Define a test variable using 100 random values: <code>x1 = random(100)</code>.</li>
                            <li>Type the equation relating the two expressions using the regression operator <code>~</code> (e.g., <code>LHS ~ RHS</code>).</li>
                            <li>Desmos will solve for any constants (<i>a</i>, <i>b</i>) so that the equation holds true for **all 100 random values of <i>x</i>**.</li>
                        </ol>
                    </div>
                    
                    <div class="tip-box">
                        <h4><i class="fa-solid fa-triangle-exclamation"></i> Why use random?</h4>
                        <p>Without <code>random(100)</code>, Desmos will default variables to <i>x</i>₁ = 1, <i>a</i> = 1, <i>b</i> = 1 and solve them like a simple single equation, yielding incorrect parameters. Generating 100 random values ensures the equation fits globally!</p>
                    </div>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>Consider the identity below, which is true for all values of <i>x</i>, where <i>a</i> and <i>b</i> are constants:</p>
                        <pre>(ax + 3)(5x² - bx + 4) = 20x³ - 9x² - 2x + 12</pre>
                        <p>What is the value of <i>ab</i>?</p>
                    `,
                    answer: "24",
                    desmosHint: "Type <code>x1 = random(100)</code> on line 1. On line 2, write the identity using <code>x1</code> and the regression operator <code>~</code>: <code>(a*x1 + 3) * (5*x1^2 - b*x1 + 4) ~ 20*x1^3 - 9*x1^2 - 2*x1 + 12</code>. Desmos solves: <code>a = 4</code> and <code>b = 6</code>. Type <code>a * b</code> on line 3 to get 24.",
                    desmosPreset: ["x1 = random(100)", "(a*x1 + 3)*(5*x1^2 - b*x1 + 4) ~ 20*x1^3 - 9*x1^2 - 2*x1 + 12", "a*b"],
                    validationType: "random-regression"
                }
            },
            {
                id: "rand-2",
                title: "Infinitely Many Solutions Shortcut",
                difficulty: "Hard",
                content: `
                    <h1>Infinitely Many Solutions</h1>
                    <p>When an equation has "infinitely many solutions," the left side must be identical to the right side for all values of <i>x</i>. We can use our <code>x1 = random(100)</code> trick to match both sides of the equation instantly.</p>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>In the given equation, <i>s</i> and <i>r</i> are constants, and <i>s</i> &gt; 0:</p>
                        <pre>(12x + 28)/4 - s/13 = r(x - 8)</pre>
                        <p>If the equation has infinitely many solutions, what is the value of <i>s</i>?</p>
                    `,
                    answer: "403",
                    desmosHint: "Enter <code>x1 = random(100)</code> on line 1. Enter the equation as a regression: <code>(12*x1 + 28)/4 - s/13 ~ r*(x1 - 8)</code>. Desmos solves <code>r = 3</code> and <code>s = 403</code>. The value of <i>s</i> is 403.",
                    desmosPreset: ["x1 = random(100)", "(12*x1 + 28)/4 - s/13 ~ r*(x1 - 8)"],
                    validationType: "random-regression"
                }
            },
            {
                id: "rand-3",
                title: "Multiple Variable Equivalency",
                difficulty: "Hard",
                content: `
                    <h1>Handling Multiple Constants</h1>
                    <p>Sometimes, the SAT relates 4 variables (like <i>p</i>, <i>q</i>, <i>r</i>, <i>s</i>) and asks which choice is equivalent. Rather than doing complex fraction simplification, set 3 variables to arbitrary values (e.g. <i>p</i> = 1.5, <i>r</i> = 1.5, <i>s</i> = 1.5) and use a regression to find <i>q</i>. Then check which choice matches!</p>
                `,
                question: {
                    type: "mcq",
                    difficulty: "Hard",
                    text: `
                        <p>The given equation relates the positive variables <i>p</i>, <i>q</i>, <i>r</i>, and <i>s</i>:</p>
                        <pre>20/p - 20/q - 20/r = 20/s</pre>
                        <p>Which of the following is equivalent to <i>q</i>?</p>
                    `,
                    options: [
                        { letter: "A", text: "p + r + s" },
                        { letter: "B", text: "20(p + r + s)" },
                        { letter: "C", text: "prs / (pr + ps + rs)" },
                        { letter: "D", text: "prs / (20p + 20r + 20s)" }
                    ],
                    answer: "C",
                    desmosHint: "Enter constants: <code>p = 1.5</code>, <code>r = 1.5</code>, <code>s = 1.5</code>. Then enter the regression <code>20/p - 20/q - 20/r ~ 20/s</code>. Desmos solves <code>q = 0.5</code>. Evaluate Option C in Desmos: <code>(p*r*s)/(p*r + p*s + r*s)</code>. It outputs <code>0.5</code>, matching <i>q</i>.",
                    desmosPreset: ["p = 1.5", "r = 1.5", "s = 1.5", "20/p - 20/q - 20/r ~ 20/s", "(p*r*s)/(p*r + p*s + r*s)"],
                    validationType: "multi-variable"
                }
            }
        ]
    },
    {
        id: "module-6",
        title: "Module 6: Percentages & Constants",
        topics: [
            {
                id: "pct-1",
                title: "Verbal Percent Translations",
                difficulty: "Hard",
                content: `
                    <h1>Translating Percentage Problems</h1>
                    <p>Verbal percentage relations (e.g., "<i>a</i> is 60% greater than <i>b</i>") can be directly typed as math equations in Desmos. To solve for relative values, initialize one variable to a constant (like <i>b</i> = 1), define the others, and use a regression to find the multiplier.</p>
                    
                    <div class="strategy-box">
                        <h4><i class="fa-solid fa-percent"></i> Percentage Translation Guide</h4>
                        <ul>
                            <li>"<i>a</i> is 60% greater than <i>b</i>" $\implies$ <code>a = 1.6 * b</code></li>
                            <li>"<i>c</i> is 45% less than <i>a</i>" $\implies$ <code>c = 0.55 * a</code></li>
                            <li>"<i>c</i> is how many times <i>b</i>?" $\implies$ <code>c ~ k * b</code> (solve for <i>k</i>)</li>
                        </ul>
                    </div>
                `,
                question: {
                    type: "numeric",
                    difficulty: "Hard",
                    text: `
                        <p>The number <i>a</i> is 60% greater than the positive number <i>b</i>. The number <i>c</i> is 45% less than <i>a</i>. The number <i>c</i> is how many times <i>b</i>?</p>
                    `,
                    answer: "0.88",
                    desmosHint: "Enter: <code>b = 1</code>, <code>a = 1.6*b</code>, and <code>c = 0.55*a</code>. Then type the regression <code>c ~ k*b</code>. Desmos solves <code>k = 0.88</code>. The answer is 0.88.",
                    desmosPreset: ["b = 1", "a = 1.6*b", "c = 0.55*a", "c ~ k*b"],
                    validationType: "percentage"
                }
            },
            {
                id: "pct-2",
                title: "Percentage Equations with Lists",
                difficulty: "Hard",
                content: `
                    <h1>Double-Defined Percentage Constants</h1>
                    <p>If a variable is defined in relation to two different percentages, you can use a list regression to solve for the multipliers and then find the percentage change.</p>
                `,
                question: {
                    type: "mcq",
                    difficulty: "Hard",
                    text: `
                        <p>The positive number <i>a</i> is 230% of the number <i>b</i>, and <i>a</i> is 60% of the number <i>c</i>. If <i>c</i> is <i>p</i>% of <i>b</i>, which of the following is closest to the value of <i>p</i>?</p>
                    `,
                    options: [
                        { letter: "A", text: "138" },
                        { letter: "B", text: "217" },
                        { letter: "C", text: "283" },
                        { letter: "D", text: "383" }
                    ],
                    answer: "D",
                    desmosHint: "Set <code>b = 1</code>. Then <code>a = 2.3*b</code>. Since <i>a</i> is 60% of <i>c</i>, write <code>c = a/0.6</code>. On line 4, type the regression: <code>c ~ (p/100)*b</code>. Desmos gives <code>p = 383.333</code>. This is closest to 383, which is Option D.",
                    desmosPreset: ["b = 1", "a = 2.3*b", "c = a/0.6", "c ~ (p/100)*b"],
                    validationType: "percentage"
                }
            }
        ]
    }
];
