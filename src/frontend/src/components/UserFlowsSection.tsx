import { useState } from "react";
import { userFlows } from "../data/userFlows";
import JourneyFlow from "./JourneyFlow";
import SectionContainer from "./SectionContainer";

export default function UserFlowsSection() {
  const [activeFlow, setActiveFlow] = useState<"buyer" | "seller">("buyer");

  return (
    <SectionContainer
      title="User Flows"
      subtitle="Step-by-step journeys for both buyers and sellers — from discovery to completed transaction."
    >
      {/* Mobile toggle */}
      <div className="flex md:hidden gap-2 mb-6">
        {userFlows.map((flow) => (
          <button
            type="button"
            key={flow.id}
            onClick={() => setActiveFlow(flow.id as "buyer" | "seller")}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-heading font-bold transition-all ${
              activeFlow === flow.id
                ? flow.color === "green"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {flow.title}
          </button>
        ))}
      </div>

      {/* Desktop: side by side */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        {userFlows.map((flow) => (
          <JourneyFlow key={flow.id} flow={flow} />
        ))}
      </div>

      {/* Mobile: single view */}
      <div className="md:hidden">
        {userFlows
          .filter((f) => f.id === activeFlow)
          .map((flow) => (
            <JourneyFlow key={flow.id} flow={flow} />
          ))}
      </div>
    </SectionContainer>
  );
}
