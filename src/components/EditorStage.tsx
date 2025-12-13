import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ChatPanel } from './editor/ChatPanel';
import { PostPreview } from './editor/PostPreview';
import { HighlightType } from '@/types';

export function EditorStage() {
  const { activePlatform } = useApp();
  const [highlight, setHighlight] = useState<HighlightType>(null);

  return (
    <div className="min-h-screen flex flex-col">

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
