import { DemoConsole } from "@/components/demo-console";
import { listFeedback, listScenarios, readScenario } from "@/lib/scenario-db";

export default function ConsolePage() {
  const scenarios = listScenarios();
  const initialScenario = readScenario(scenarios[0].slug);
  const initialFeedback = listFeedback(initialScenario.slug);

  return (
    <>
      <div style={{ position: "fixed", right: 20, top: 20, zIndex: 30, display: "flex", gap: 12 }}>
        <a
          href="/?section=demo-flow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 16px",
            borderRadius: 999,
            background: "rgba(15, 23, 42, 0.92)",
            color: "#fff",
            textDecoration: "none"
          }}
        >
          Demo 架构页
        </a>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 16px",
            borderRadius: 999,
            background: "#fff",
            color: "#0f172a",
            textDecoration: "none",
            border: "1px solid rgba(15, 23, 42, 0.12)"
          }}
        >
          返回首页
        </a>
      </div>
      <DemoConsole
        initialScenario={initialScenario}
        scenarioSummaries={scenarios}
        initialFeedback={initialFeedback}
      />
    </>
  );
}
