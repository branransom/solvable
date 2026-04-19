import type { Lesson } from "../types";

export const lesson2: Lesson = {
  id: "monitoring-and-observability",
  title: "Monitoring and Observability",
  blocks: [
    {
      type: "prose",
      content: `
        <p>An optimization model that works perfectly today can silently degrade tomorrow.
        Input data drifts. Business rules change. The model that once produced excellent
        plans starts producing plans that are feasible but bad, and nobody notices because
        the solver still says "optimal."</p>
      `,
    },
    {
      type: "prose",
      content: `
        <h3>Solver health</h3>
        <p><strong>Solve time</strong>: Track p50, p95, and p99 solve times. A gradual
        increase means the problem is growing (more variables, more constraints as the
        business scales). A sudden spike means something changed in the input data that
        makes the model harder to solve.</p>

        <p><strong>MIP gap at termination</strong>: If you're solving MIPs to a gap
        tolerance (e.g., 1%), track how often the solver hits the time limit before reaching
        the target. If this starts happening frequently, the problems are getting harder
        faster than you expected.</p>

        <p><strong>Numerical warnings</strong>: Track solver warnings about conditioning,
        large coefficients, or basis issues. For large-scale LPs, numerical stability is a
        primary concern. An increase in warning frequency often precedes solve failures.</p>
      `,
    },
    {
      type: "prose",
      content: `
        <h3>Decision quality</h3>
        <p><strong>Objective value trend</strong>: Plot the optimal objective over time.
        If cost is increasing week over week, is it because input prices rose, or because
        the model is making worse decisions? Compare the optimizer's cost against a simple
        baseline (e.g., "repeat last week's plan") to measure how much value the optimization
        is actually adding.</p>

        <p><strong>Constraint binding patterns</strong>: A constraint that's always binding
        is a capacity bottleneck the business should know about. If warehouse capacity in
        a region is binding every single run, that's a signal to the business, not just to
        the model. A constraint that never binds may be dead weight that can be removed to
        simplify the model.</p>

        <p><strong>Operator override rate</strong>: Track how often planners override the
        solver's recommendations, and on which decisions. If overrides are increasing, either
        the model doesn't match operational reality or operators don't trust it. Both are
        problems. If overrides are concentrated on specific lanes or facilities, that's a
        signal about where the model's assumptions break down.</p>
      `,
    },
    {
      type: "prose",
      content: `
        <h3>System health</h3>
        <p><strong>Data freshness at solve time</strong>: Were all inputs within their
        freshness SLA when the solver ran? If demand data was stale for 15% of runs
        last month, that's a data pipeline reliability problem masquerading as an
        optimization problem.</p>

        <p><strong>Infeasibility rate</strong>: How often does the solver return infeasible?
        If it's consistently higher on certain days or after certain upstream processes run,
        that's a pattern worth investigating. Infeasibility spikes often correlate with
        specific data sources.</p>

        <p><strong>Fallback rate</strong>: How often is the system using cached solutions
        or heuristic fallbacks instead of fresh solves? A rising fallback rate means the
        solver is failing more often, even if the system is still producing plans.</p>
      `,
    },
    {
      type: "prediction",
      question: "Solve times have been steady at 3 minutes for months. This week they jumped to 15 minutes. The model didn't change. What's the most likely cause?",
      options: [
        "The server hardware is degrading",
        "The input data changed in a way that makes the problem harder to solve",
        "The solver needs to be restarted",
      ],
      correct_index: 1,
      explanation: `The model didn't change, but the data did. Maybe demand spiked in a way that
        tightens constraints, or a data error introduced inconsistencies that make the solver
        work harder. Compare this week's input data against last week's, focusing on size
        (more rows, more variables) and structure (tighter constraints, more binding limits).`,
    },
    {
      type: "prose",
      content: `
        <h3>Shadow testing new models</h3>
        <p>Before deploying a new model version, run it in shadow mode: feed it the same
        inputs as the current model and compare the outputs. If the new model produces
        significantly different solutions, understand why before switching over.</p>
        <p>Key comparisons:</p>
        <ul>
          <li>Objective value: is the new model consistently better?</li>
          <li>Solution structure: are the same facilities, routes, or assignments selected?</li>
          <li>Solve time: is the new model faster or slower?</li>
          <li>Edge cases: does the new model handle unusual inputs gracefully?</li>
        </ul>
      `,
    },
    {
      type: "go_deeper",
      title: "When the LP is very large",
      content: `
        <p>The examples in this tutorial have a handful of variables. Production planning
        models can have millions of variables and constraints spanning weeks or months of
        decisions linked together over time.</p>
        <p>At this scale, the failure modes are different from small models:</p>
        <ul>
          <li><strong>Numerical conditioning</strong>: with millions of coefficients spanning
          many orders of magnitude, the solver's floating-point arithmetic accumulates
          errors. Watch for solver warnings about large matrix coefficients or ill-conditioned
          bases. These are early signs that results may be unreliable.</li>
          <li><strong>Memory</strong>: the constraint matrix, basis factorization, and solution
          vectors all consume memory. A model that solves fine in staging can OOM in production
          if the instance is larger than expected. Monitor memory alongside solve time.</li>
          <li><strong>Presolve sensitivity</strong>: for large models, the presolve step
          (where the solver simplifies the model before solving) can dramatically affect
          performance. A model that presolves well might solve in 30 seconds; the same
          model with slightly different data that doesn't presolve as effectively might
          take 30 minutes. If solve times are volatile, check whether presolve reductions
          are consistent across runs.</li>
        </ul>
      `,
    },
    {
      type: "checkpoint",
      message: "Monitor solver health, decision quality, and system health. Solve time and objective value tell you about the solver. Override rates and infeasibility patterns tell you about the system.",
    },
  ],
};
