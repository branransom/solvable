<script lang="ts">
  import InteractivePlot from "./InteractivePlot.svelte";

  interface Props {
    on_start: () => void;
  }

  let { on_start }: Props = $props();

  const demo_model = {
    variables: ["x", "y"] as [string, string],
    objective: { coefficients: [5, 4] as [number, number], sense: "max" as const },
    constraints: [
      { name: "capacity", coefficients: [1, 1] as [number, number], operator: "<=" as const, rhs: 10, enabled: true, color: "#4c6ef5" },
      { name: "machine_time", coefficients: [2, 1] as [number, number], operator: "<=" as const, rhs: 14, enabled: true, color: "#f76707" },
      { name: "labor", coefficients: [1, 3] as [number, number], operator: "<=" as const, rhs: 18, enabled: true, color: "#20c997" },
    ],
  };
</script>

<div class="landing">
  <div class="landing-content">
    <div class="hero-text">
      <h1 class="title">solvable</h1>
      <p class="subtitle">An interactive tutorial on mathematical optimization for software engineers.</p>
      <p class="description">
        Learn to formulate and solve linear programs, integer programs, and real-world
        optimization problems. Everything runs in your browser, powered by the
        <a href="https://highs.dev" target="_blank" rel="noopener">HiGHS</a> solver
        compiled to WebAssembly.
      </p>
      <p class="description">
        Drag constraints. Watch the feasible region change. See what the solver sees.
      </p>
      <button class="start-button" onclick={on_start}>
        Start learning
        <span class="start-arrow">→</span>
      </button>
    </div>

    <div class="hero-plot">
      <InteractivePlot
        model={demo_model}
        allow_drag_constraints={true}
        allow_drag_objective={false}
        allow_drag_point={true}
        allow_toggle_constraints={false}
        show_objective_contour={true}
        show_gradient_arrow={true}
        show_vertex_labels={false}
        highlight_optimal={true}
      />
    </div>
  </div>

</div>

<style>
  .landing {
    min-height: 100vh;
    overflow-y: auto;
    padding: 2rem;
  }

  .landing-content {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    min-height: 70vh;
  }

  .hero-text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .title {
    font-size: 3rem;
    font-weight: 600;
    color: #f0f2f7;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .subtitle {
    font-size: 1.15rem;
    color: #abb2bf;
    line-height: 1.5;
  }

  .description {
    font-size: 0.95rem;
    color: #6b7084;
    line-height: 1.6;
  }

  .description a {
    color: #4c6ef5;
    text-decoration: none;
  }

  .description a:hover {
    text-decoration: underline;
  }

  .start-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 2rem;
    background: #4c6ef5;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.05rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    margin-top: 0.5rem;
    align-self: flex-start;
  }

  .start-button:hover {
    background: #5c7cfa;
    transform: translateX(2px);
  }

  .start-arrow {
    font-size: 1.1rem;
    transition: transform 0.15s;
  }

  .start-button:hover .start-arrow {
    transform: translateX(3px);
  }

  .hero-plot {
    min-height: 350px;
    max-height: 500px;
  }

  @media (max-width: 768px) {
    .landing {
      padding: 1.5rem 1rem;
    }

    .landing-content {
      grid-template-columns: 1fr;
      gap: 2rem;
      min-height: auto;
    }

    .title {
      font-size: 2.2rem;
    }

    .hero-plot {
      min-height: 280px;
      max-height: 400px;
    }

  }
</style>
