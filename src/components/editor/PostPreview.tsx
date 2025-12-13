import { useApp } from '@/contexts/AppContext';
import { HighlightType } from '@/types';
import pavleAvatar from '@/assets/pavle-avatar.png';

interface PostPreviewProps {
  highlight: HighlightType;
}

const highlightColors: Record<string, string> = {
  hook: 'bg-highlight-hook/20 border-l-4 border-highlight-hook',
  body: 'bg-highlight-body/20 border-l-4 border-highlight-body',
  outro: 'bg-highlight-outro/20 border-l-4 border-highlight-outro',
  image: 'ring-4 ring-highlight-image',
  text: 'bg-highlight-text/20 border-l-4 border-highlight-text',
};

export function PostPreview({ highlight }: PostPreviewProps) {
  const { activePlatform, generatedContent } = useApp();

  if (activePlatform === 'linkedin') {
    const post = generatedContent.linkedin;
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* LinkedIn Header */}
        <div className="p-4 flex items-start gap-3 border-b border-border">
          <img src={pavleAvatar} alt="Pavle Padjin" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-foreground">Pavle Padjin</p>
            <p className="text-sm text-muted-foreground"><span className="font-semibold">Forsails</span> Co-Founder</p>
            <p className="text-xs text-muted-foreground">Just now</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className={`p-3 rounded-lg transition-all duration-300 ${highlight === 'hook' ? highlightColors.hook : ''}`}>
            <p className="text-foreground text-lg">{post.hook}</p>
          </div>
          
          <div className={`p-3 rounded-lg transition-all duration-300 ${highlight === 'body' ? highlightColors.body : ''}`}>
            <p className="text-foreground leading-relaxed">{post.body}</p>
          </div>
          
          <div className={`p-3 rounded-lg transition-all duration-300 ${highlight === 'outro' ? highlightColors.outro : ''}`}>
            <p className="text-foreground font-medium">{post.outro}</p>
          </div>
        </div>

        {/* Image */}
        <div className={`transition-all duration-300 ${highlight === 'image' ? highlightColors.image : ''}`}>
          <img
            src={post.image}
            alt="Post visual"
            className="w-full h-48 object-cover"
          />
        </div>

        {/* Engagement Bar */}
        <div className="p-4 border-t border-border flex items-center justify-around text-muted-foreground text-sm">
          <span>👍 Like</span>
          <span>💬 Comment</span>
          <span>🔄 Repost</span>
          <span>📤 Send</span>
        </div>
      </div>
    );
  }

  if (activePlatform === 'twitter') {
    const post = generatedContent.twitter;
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Twitter Header */}
        <div className="p-4 flex items-start gap-3">
          <img src={pavleAvatar} alt="Pavle Padjin" className="w-12 h-12 rounded-full object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-bold text-foreground">Pavle Padjin</p>
              <span className="text-muted-foreground text-xs"><span className="font-semibold">Forsails</span> Co-Founder</span>
              <p className="text-muted-foreground text-sm">@pavlepadjin • 1m</p>
            </div>
            
            {/* Content */}
            <div className={`mt-2 p-2 rounded-lg transition-all duration-300 ${highlight === 'text' ? highlightColors.text : ''}`}>
              <p className="text-foreground text-sm leading-relaxed">{post.text}</p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className={`mx-4 mb-4 rounded-xl overflow-hidden transition-all duration-300 ${highlight === 'image' ? highlightColors.image : ''}`}>
          <img
            src={post.image}
            alt="Post visual"
            className="w-full aspect-video object-cover"
          />
        </div>

        {/* Engagement Bar */}
        <div className="px-4 pb-4 flex items-center justify-around text-muted-foreground text-sm">
          <span>💬 123</span>
          <span>🔁 456</span>
          <span>❤️ 789</span>
          <span>📊 1.2K</span>
        </div>
      </div>
    );
  }

  // Instagram
  const post = generatedContent.instagram;
  return (
    <div className="origin-top scale-[0.85]">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Instagram Header */}
        <div className="p-3 flex items-center gap-3">
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-instagram-orange to-instagram-pink">
            <img src={pavleAvatar} alt="Pavle Padjin" className="w-10 h-10 rounded-full object-cover border-2 border-card" />
          </div>
          <p className="font-semibold text-foreground">pavlepadjin</p>
        </div>

        {/* Image */}
        <div className={`transition-all duration-300 ${highlight === 'image' ? highlightColors.image : ''}`}>
          <img
            src={post.image}
            alt="Post visual"
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* Actions */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4 text-foreground">
              <span className="text-xl cursor-pointer hover:opacity-70">❤️</span>
              <span className="text-xl cursor-pointer hover:opacity-70">💬</span>
              <span className="text-xl cursor-pointer hover:opacity-70">📤</span>
            </div>
            <span className="text-xl cursor-pointer hover:opacity-70">🔖</span>
          </div>
          
          <p className="font-semibold text-sm mb-2">1,234 likes</p>
          
          {/* Caption */}
          <div className={`p-3 rounded-lg transition-all duration-300 ${highlight === 'text' ? highlightColors.text : ''}`}>
            <p className="text-foreground text-sm">
              <span className="font-semibold mr-1">pavlepadjin</span>
              {post.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
