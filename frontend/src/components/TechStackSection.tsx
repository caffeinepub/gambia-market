import SectionContainer from './SectionContainer';
import TechStackCard from './TechStackCard';
import { techStackItems } from '../data/techStack';

export default function TechStackSection() {
  return (
    <SectionContainer
      title="Recommended Tech Stack"
      subtitle="Technologies chosen for performance on low-end Android devices and slow internet connections in The Gambia."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {techStackItems.map((item) => (
          <TechStackCard key={item.id} item={item} />
        ))}
      </div>
    </SectionContainer>
  );
}
