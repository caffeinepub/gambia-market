import { databaseEntities } from "../data/database";
import EntityCard from "./EntityCard";
import SectionContainer from "./SectionContainer";

export default function DatabaseStructureSection() {
  return (
    <SectionContainer
      title="Database Structure"
      subtitle="6 core entities that power the Gambia Market backend. Designed for scalability and fast queries."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {databaseEntities.map((entity) => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </SectionContainer>
  );
}
