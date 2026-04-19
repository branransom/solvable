import type { Lesson } from "../types";

export const lesson3: Lesson = {
  id: "explaining-and-auditing-decisions",
  title: "Explaining and Auditing Decisions",
  blocks: [
    {
      type: "prose",
      content: `
        <p>A stakeholder asks: "Why did the system recommend shipping from warehouse A
        instead of warehouse B?" The answer can't be "because the solver said so."</p>
        <p>The system needs to support after-the-fact investigation of any decision it
        made. That requires storing the right artifacts and making them retrievable.</p>
      `,
    },
    {
      type: "prose",
      content: `
        <h3>What to store per solve run</h3>
        <p>Every solve should produce a durable record with a run ID that links:</p>
        <ul>
          <li><strong>Input snapshot</strong>: the exact data the model saw when it solved.
          If you can't reproduce the inputs, you can't explain the output. This means
          versioning or snapshotting the input tables at solve time, not just pointing at
          a live table that has since been overwritten.</li>
          <li><strong>Solution values</strong>: what the solver decided. The full variable
          values, not just a summary. You need to be able to answer "what did the system
          recommend for facility X on March 15?"</li>
          <li><strong>Solver metadata</strong>: status (optimal, time limit, infeasible),
          solve time, MIP gap if applicable. This is essential for diagnosing whether a
          bad outcome was caused by bad data, a bad model, or the solver running out of time.</li>
        </ul>
      `,
    },
    {
      type: "prose",
      content: `
        <h3>Making it queryable</h3>
        <p>Storing artifacts is not enough. A planner needs to pull up last Tuesday's run
        and compare it to this Tuesday's run without parsing raw files. The system should
        support queries like:</p>
        <ul>
          <li>"What did the system recommend for region X last week?"</li>
          <li>"What changed between this run and the previous run?"</li>
          <li>"Which runs in the last month were infeasible, and what data did they use?"</li>
        </ul>
        <p>The structure doesn't need to be complex. A run ID, a timestamp, the solve
        status, and pointers to the stored input and output snapshots cover most needs.</p>
      `,
    },
    {
      type: "prose",
      content: `
        <h3>Tracking operator overrides</h3>
        <p>When a planner overrides the solver's recommendation, that's information.
        The system should capture:</p>
        <ul>
          <li>What the solver recommended</li>
          <li>What the planner changed it to</li>
          <li>Why (a free-text reason or a category: "carrier unreliable," "customer request,"
          "data looks wrong")</li>
        </ul>
        <p>Over time, override patterns reveal where the model's assumptions don't match
        reality. If planners consistently override a specific lane, maybe the cost data
        for that lane is wrong, or there's a constraint the model doesn't capture.
        This is a feedback signal that should reach whoever maintains the model.</p>
      `,
    },
    {
      type: "prediction",
      question: "A planner consistently overrides the solver's recommendation for a specific lane, citing 'the carrier on that lane is unreliable.' What should the system do with this information?",
      options: [
        "Nothing. Overrides are the planner's prerogative.",
        "Block the planner from overriding the solver.",
        "Surface the pattern to the modeling team. Carrier reliability isn't captured in the model, and it should be.",
      ],
      correct_index: 2,
      explanation: `Repeated overrides on the same decision are a signal that the model is missing
        something. In this case, the model optimizes on cost and capacity but doesn't account
        for carrier reliability. The planner is correcting for a gap the model doesn't see.
        Surfacing this to the modeling team lets them decide whether to add a reliability
        factor to the model, adjust the cost for that lane, or add a constraint.`,
    },
    {
      type: "prose",
      content: `
        <h3>Explainability builds trust</h3>
        <p>If planners can see why the system made a recommendation, they're more likely
        to follow it. "Ship from warehouse A because warehouse B is at capacity and the
        marginal shipping cost from A is $2/unit lower" is a reason a planner can evaluate.</p>
        <p>If they can't see why, they override it. The system becomes an expensive
        suggestion box. Building the retrieval and comparison infrastructure isn't
        glamorous, but it's often the difference between a system that's trusted and one
        that's tolerated.</p>
      `,
    },
    {
      type: "checkpoint",
      message: "Store input snapshots, solutions, and solver metadata per run. Track operator overrides. Make it all queryable. The system earns trust by being explainable.",
    },
  ],
};
