import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ChatPanel } from './editor/ChatPanel';
import { PostPreview } from './editor/PostPreview';
import { Platform, HighlightType } from '@/types';
import { Linkedin, Twitter } from 'lucide-react';
import instagramIcon from '@/assets/instagram-icon.png';

const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
  { id: 'twitter', label: 'X', icon: <Twitter className="w-4 h-4" /> },
  { 
    id: 'instagram', 
    label: 'Instagram', 
    icon: <img src={instagramIcon} alt="Instagram" className="w-4 h-4" />
  },
];

export function EditorStage() {
  const { activePlatform, setActivePlatform } = useApp();
  const [highlight, setHighlight] = useState<HighlightType>(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Platform Tabs */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setActivePlatform(platform.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 ${
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 h-full">
          {/* Chat Panel */}
          <div className="lg:h-[calc(100vh-200px)]">
            <ChatPanel onHighlightChange={setHighlight} />
          </div>

          {/* Post Preview */}
          <div className="lg:h-[calc(100vh-200px)] overflow-y-auto">
            <PostPreview highlight={highlight} />
          </div>
        </div>
      </div>
    </div>
  );
}
