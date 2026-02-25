import { ScrollArea } from '@/components/ui/scroll-area';

export type TabId =
  | 'features'
  | 'userflows'
  | 'database'
  | 'techstack'
  | 'mvp'
  | 'future'
  | 'monetization'
  | 'roadmap';

interface Tab {
  id: TabId;
  label: string;
  emoji: string;
}

const tabs: Tab[] = [
  { id: 'features', label: 'Features', emoji: '⚡' },
  { id: 'userflows', label: 'User Flows', emoji: '🔄' },
  { id: 'database', label: 'Database', emoji: '🗄️' },
  { id: 'techstack', label: 'Tech Stack', emoji: '🛠️' },
  { id: 'mvp', label: 'MVP Plan', emoji: '🚀' },
  { id: 'future', label: 'Future Features', emoji: '🔮' },
  { id: 'monetization', label: 'Monetization', emoji: '💰' },
  { id: 'roadmap', label: 'Roadmap', emoji: '🗺️' },
];

interface NavigationTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <nav className="sticky top-0 z-30 bg-card border-b border-border shadow-xs">
      <div className="kente-pattern-thin" />
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max px-4 py-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-1.5 px-4 py-3.5 text-sm font-body font-semibold whitespace-nowrap
                  border-b-2 transition-all duration-200 focus:outline-none
                  ${isActive
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
