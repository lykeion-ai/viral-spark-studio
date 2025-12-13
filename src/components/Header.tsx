import { User, Linkedin, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Platform } from '@/types';
import { useLocation } from 'react-router-dom';
import instagramIcon from '@/assets/instagram-icon.png';
import xIcon from '@/assets/x-icon.png';

const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
  { id: 'twitter', label: 'X', icon: <img src={xIcon} alt="X" className="w-4 h-4" /> },
  { 
    id: 'instagram', 
    label: 'Instagram', 
    icon: <img src={instagramIcon} alt="Instagram" className="w-4 h-4" />
  },
];

export function Header() {
  const { activePlatform, setActivePlatform } = useApp();
  const location = useLocation();
  const showTabs = location.pathname === '/edit';

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50 w-full">
      <nav className="w-full py-2 flex justify-between items-center px-4">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Marketly</span>
        </div>

        {/* Center - Platform Tabs (only in editor stage) */}
        <div className="flex-1 flex justify-center">
          {showTabs && (
            <div className="flex gap-1">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setActivePlatform(platform.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                    activePlatform === platform.id
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  {platform.icon}
                  {platform.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right - Account icon */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </nav>
    </header>
  );
}