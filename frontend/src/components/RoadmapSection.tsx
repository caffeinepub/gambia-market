import SectionContainer from './SectionContainer';
import RoadmapPhaseCard from './RoadmapPhaseCard';
import { roadmapPhases } from '../data/roadmap';

export default function RoadmapSection() {
  return (
    <SectionContainer
      title="Development Roadmap"
      subtitle="4 phases from MVP launch to a scaled, monetized marketplace across West Africa."
    >
      <div className="max-w-3xl">
        {roadmapPhases.map((phase, index) => (
          <RoadmapPhaseCard
            key={phase.phase}
            phase={phase}
            isLast={index === roadmapPhases.length - 1}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
