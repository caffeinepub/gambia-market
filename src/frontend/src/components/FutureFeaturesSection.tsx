import SectionContainer from './SectionContainer';
import FutureFeatureCard from './FutureFeatureCard';
import { futureFeatures } from '../data/futureFeatures';

export default function FutureFeaturesSection() {
  const phase2 = futureFeatures.filter((f) => f.phase === 'Phase 2');
  const phase3 = futureFeatures.filter((f) => f.phase === 'Phase 3');

  return (
    <SectionContainer
      title="Future Features"
      subtitle="Post-MVP capabilities that will differentiate Gambia Market and drive long-term growth."
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-heading font-bold px-3 py-1 rounded-full">
            Phase 2 — Months 3–6
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {phase2.map((feature) => (
            <FutureFeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-secondary/15 text-secondary border border-secondary/20 text-xs font-heading font-bold px-3 py-1 rounded-full">
            Phase 3 — Months 7–12
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {phase3.map((feature) => (
            <FutureFeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
