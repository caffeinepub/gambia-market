import { DatabaseEntity } from '../types/blueprint';

interface EntityCardProps {
  entity: DatabaseEntity;
}

export default function EntityCard({ entity }: EntityCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
      {/* Header */}
      <div className="bg-primary/8 border-b border-border px-5 py-3 flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-base text-foreground">{entity.name}</h3>
          <p className="text-muted-foreground text-xs font-body mt-0.5">{entity.description}</p>
        </div>
        <span className="text-xs font-body font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
          {entity.fields.length} fields
        </span>
      </div>

      {/* Fields table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-4 py-2 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Field</th>
              <th className="text-left px-4 py-2 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-2 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Description</th>
            </tr>
          </thead>
          <tbody>
            {entity.fields.map((field, i) => (
              <tr key={field.name} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                <td className="px-4 py-2 font-body font-semibold text-foreground text-xs whitespace-nowrap">
                  <code className="bg-primary/8 text-primary px-1.5 py-0.5 rounded text-xs">{field.name}</code>
                </td>
                <td className="px-4 py-2 text-xs font-body text-secondary whitespace-nowrap">
                  <code className="bg-secondary/10 text-secondary px-1.5 py-0.5 rounded text-xs">{field.type}</code>
                </td>
                <td className="px-4 py-2 text-xs font-body text-muted-foreground hidden sm:table-cell">{field.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Relationships */}
      {entity.relationships.length > 0 && (
        <div className="px-5 py-3 border-t border-border bg-accent/5">
          <p className="text-xs font-body font-semibold text-accent-foreground mb-1.5">Relationships</p>
          <div className="flex flex-wrap gap-1.5">
            {entity.relationships.map((rel) => (
              <span key={rel} className="text-xs font-body bg-accent/15 text-accent-foreground px-2 py-0.5 rounded-full">
                {rel}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
