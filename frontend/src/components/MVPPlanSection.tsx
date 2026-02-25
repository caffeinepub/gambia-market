import SectionContainer from './SectionContainer';
import MVPTimeline from './MVPTimeline';
import { mvpFeatures, mvpTimeline } from '../data/mvpPlan';
import { CheckCircle2, Circle } from 'lucide-react';

export default function MVPPlanSection() {
  const mustHave = mvpFeatures.filter((f) => f.priority === 'must-have');
  const niceToHave = mvpFeatures.filter((f) => f.priority === 'nice-to-have');

  return (
    <SectionContainer
      title="MVP Plan"
      subtitle="The minimum viable product to launch quickly and validate the market. Focus on must-haves first."
    >
      {/* Feature checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Must Have */}
        <div className="bg-card border border-primary/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary text-primary-foreground text-xs font-heading font-bold px-3 py-1 rounded-full">
              ✅ Must Have
            </span>
            <span className="text-xs text-muted-foreground font-body">Launch blockers</span>
          </div>
          <ul className="space-y-2.5">
            {mustHave.map((feature) => (
              <li key={feature.id} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-body text-foreground">{feature.title}</span>
                  {feature.featureRef && (
                    <span className="ml-1.5 text-xs text-muted-foreground font-body">({feature.featureRef})</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Nice to Have */}
        <div className="bg-card border border-accent/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-accent/20 text-accent-foreground text-xs font-heading font-bold px-3 py-1 rounded-full border border-accent/30">
              ⭐ Nice to Have
            </span>
            <span className="text-xs text-muted-foreground font-body">V1 stretch goals</span>
          </div>
          <ul className="space-y-2.5">
            {niceToHave.map((feature) => (
              <li key={feature.id} className="flex items-start gap-2.5">
                <Circle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-body text-foreground">{feature.title}</span>
                  {feature.featureRef && (
                    <span className="ml-1.5 text-xs text-muted-foreground font-body">({feature.featureRef})</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="font-heading font-bold text-lg text-foreground mb-4">8-Week Development Timeline</h3>
        <MVPTimeline weeks={mvpTimeline} />
      </div>
    </SectionContainer>
  );
}
