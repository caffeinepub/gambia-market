import { useState } from 'react';
import NavigationTabs, { TabId } from './components/NavigationTabs';
import HeroSection from './components/HeroSection';
import PatternDivider from './components/PatternDivider';
import FeatureBreakdownSection from './components/FeatureBreakdownSection';
import UserFlowsSection from './components/UserFlowsSection';
import DatabaseStructureSection from './components/DatabaseStructureSection';
import TechStackSection from './components/TechStackSection';
import MVPPlanSection from './components/MVPPlanSection';
import FutureFeaturesSection from './components/FutureFeaturesSection';
import MonetizationSection from './components/MonetizationSection';
import RoadmapSection from './components/RoadmapSection';
import { Heart } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('features');

  const renderSection = () => {
    switch (activeTab) {
      case 'features':
        return <FeatureBreakdownSection />;
      case 'userflows':
        return <UserFlowsSection />;
      case 'database':
        return <DatabaseStructureSection />;
      case 'techstack':
        return <TechStackSection />;
      case 'mvp':
        return <MVPPlanSection />;
      case 'future':
        return <FutureFeaturesSection />;
      case 'monetization':
        return <MonetizationSection />;
      case 'roadmap':
        return <RoadmapSection />;
      default:
        return <FeatureBreakdownSection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col batik-bg">
      {/* Hero */}
      <HeroSection />

      {/* Kente divider */}
      <PatternDivider />

      {/* Navigation */}
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1">
        {renderSection()}
      </main>

      {/* Kente divider before footer */}
      <PatternDivider />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-black text-sm">G</span>
            </div>
            <span className="font-heading font-bold text-foreground">Gambia Market</span>
            <span className="text-muted-foreground text-sm font-body">— Product Blueprint</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground font-body">
            <span>© {new Date().getFullYear()} Gambia Market Blueprint</span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1">
              Built with{' '}
              <Heart className="w-3.5 h-3.5 text-secondary fill-secondary inline" />{' '}
              using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'gambia-market')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
