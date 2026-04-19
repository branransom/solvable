import type { Lesson } from "../types";

export const lesson1: Lesson = {
  id: "validating-inputs-and-outputs",
  title: "Validating Inputs and Outputs",
  blocks: [
    {
      type: "prose",
      content: `
        <p>The solver optimizes the model it receives. It has no opinion about whether
        the inputs are right or whether the output makes operational sense. That's the
        system's job.</p>
      `,
    },
    {
      type: "prose",
      content: `
        <h3>Data freshness</h3>
        <p>Pipelines fail silently. A job upstream errors out, and the demand table
        doesn't refresh. The solver runs against yesterday's data and produces a
        technically optimal plan for a world that no longer exists.</p>
        <p>The system should track freshness per data source. If demand data is 12 hours
        old when the expectation is hourly, the solve should be blocked or flagged before
        it runs. Not after.</p>
      `,
    },
    {
      type: "prose",
      content: `
        <h3>Manual overrides</h3>
        <p>Planners adjust forecasts. Operations teams update capacities. Business
        users override costs. These manual inputs are the most dangerous data entering
        the model because they bypass automated validation.</p>
        <p>If someone updates a warehouse capacity from 10,000 to 100,000, the solver
        will happily route everything there. The model isn't wrong. The system failed to
        catch a bad input.</p>
        <p>Guardrails for manual data:</p>
        <ul>
          <li>Flag values that deviate significantly from baseline and require confirmation</li>
          <li>Enforce bounds on critical fields (capacity can't be negative, cost can't be zero)</li>
          <li>Maintain an audit trail: who changed what, when, and ideally why</li>
        </ul>
      `,
    },
    {
      type: "prose",
      content: `
        <h3>Missing data</h3>
        <p>A blank field in a manual upload has consequences. A warehouse with missing
        capacity might be treated as zero capacity, effectively closing it. Or it might
        be treated as unlimited capacity, making it a black hole for volume.</p>
        <p>The system must define what missing means for every field and enforce it
        consistently. "We treat nulls as zero" is a valid policy. "Sometimes it's zero,
        sometimes it's the previous value" is a bug waiting to surface in a solver output
        that nobody can explain.</p>
      `,
    },
    {
      type: "prediction",
      question: "A planner manually updates demand for one region from 500 to 50,000 units. The solver returns infeasible. Where did the system fail?",
      options: [
        "The solver has a bug",
        "The model needs more constraints to handle high demand",
        "The system accepted a 100x override without validation or confirmation",
      ],
      correct_index: 2,
      explanation: `The solver did exactly what it was told. 50,000 units exceeds the supply
        chain's capacity, so no feasible plan exists. The failure is upstream: the system
        should have flagged a 100x deviation from baseline and asked the planner to confirm
        before passing it to the solver.`,
    },
    {
      type: "prose",
      content: `
        <h3>Output sanity checks</h3>
        <p>The solver returns "optimal." That means it found the best solution to the model
        it received. It does not mean the answer is correct.</p>
        <p>Business-level checks the system should perform:</p>
        <ul>
          <li><strong>Compare against recent runs.</strong> A sudden 30% change in the objective
          value usually means the inputs changed, not that the solver got smarter. Investigate
          before acting on it.</li>
          <li><strong>Check for degenerate behavior.</strong> All volume routed through one
          warehouse while others sit idle. A facility that should be active producing nothing.
          These are technically optimal but usually indicate a data problem (a cost that's
          too low, a capacity that's too high).</li>
          <li><strong>Cross-check totals.</strong> Total supply should roughly match total
          demand (plus allowed inventory changes). If they diverge, something in the input
          or model is inconsistent.</li>
        </ul>
      `,
    },
    {
      type: "checkpoint",
      message: "The solver optimizes the model. The system validates the world around it: freshness, override guardrails, missing data semantics, and output sanity checks.",
    },
  ],
};
