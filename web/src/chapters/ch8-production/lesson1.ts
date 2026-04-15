import type { Lesson } from "../types";

export const lesson1: Lesson = {
  id: "solver-as-a-service",
  title: "The Solver as a Service",
  blocks: [
    {
      type: "prose",
      content: `
        <p>You've learned to formulate and solve optimization problems. Now the question
        is: how do you put this into a production system that runs reliably, handles
        failures, and serves results to other services?</p>
      `,
    },
    {
      type: "prose",
      content: `
        <h3>Architecture pattern: solve behind an API</h3>
        <p>The standard pattern is a service that accepts problem data, builds the model,
        solves it, and returns the solution. The caller doesn't know or care that an LP
        solver is involved.</p>
        <pre><code>POST /api/optimize-routes
{
  "warehouses": [...],
  "orders": [...],
  "vehicles": [...]
}

→ 200 OK
{
  "routes": [...],
  "total_cost": 4523.50,
  "solve_time_ms": 340,
  "gap": 0.01
}</code></pre>
        <p>The model construction, solver call, and solution interpretation all happen
        server-side. The API consumer sees a domain-specific interface, not an LP.</p>
      `,
    },
    {
      type: "prose",
      content: `
        <h3>Time limits are not optional</h3>
        <p>Every production solver call needs a time limit. MIP solve times are
        unpredictable — a problem that usually solves in 2 seconds might take 20 minutes
        on a slightly different input. Without a time limit, one bad input can hang your
        service.</p>
        <p>Set the time limit based on your SLA, not the problem. If your service needs
        to respond in 5 seconds, set the solver time limit to 3 seconds (leaving room for
        model construction and response formatting).</p>
        <p>When the time limit hits, return the <strong>incumbent</strong> (best solution
        found so far) along with the MIP gap. A 2% suboptimal solution delivered on time
        is better than the optimal solution delivered never.</p>
      `,
    },
    {
      type: "prediction",
      question: "Your optimization service has a 10-second SLA. The solver usually finishes in 3 seconds but occasionally takes 60+. What should you do?",
      options: [
        "Set the solver time limit to 10 seconds — match the SLA",
        "Set the solver time limit to 7-8 seconds and return the incumbent if it hits the limit, with the gap reported in the response",
        "Run the solver asynchronously and have the client poll for results",
      ],
      correct_index: 1,
      explanation: `Leave headroom between the solver time limit and your SLA for model construction,
        solution extraction, and network overhead. Return the incumbent + gap when the limit hits.
        The async pattern (option 3) is valid for batch workloads but adds complexity for
        request-response APIs.`,
    },
    {
      type: "prose",
      content: `
        <h3>Fallback strategies</h3>
        <p>What happens when the solver fails entirely? Crashes, returns infeasible on
        valid input, or times out with no incumbent?</p>
        <ul>
          <li><strong>Cached solution</strong>: return the last known good solution for similar input.
          Often "yesterday's optimal plan" is better than "no plan."</li>
          <li><strong>Heuristic fallback</strong>: a fast greedy algorithm that produces a feasible
          (but not optimal) solution in milliseconds. Always have one ready.</li>
          <li><strong>Relaxed solve</strong>: drop the integer requirements and return the LP
          relaxation solution. It won't be implementable directly but gives useful direction.</li>
        </ul>
        <p>The key principle: <strong>never return nothing.</strong> A suboptimal answer is
        almost always better than an error page.</p>
      `,
    },
    {
      type: "checkpoint",
      message: "You know the production pattern: solver behind an API, always set time limits, always have a fallback.",
    },
  ],
};
