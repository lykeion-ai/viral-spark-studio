import { Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { SocialPost } from '@/types';

interface TwitterPostProps {
  post: SocialPost;
  isSelected?: boolean;
  isDimmed?: boolean;
  compact?: boolean;
}

export function TwitterPost({ post, isSelected, isDimmed, compact }: TwitterPostProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div
      className={`social-post-card twitter-post p-4 transition-all duration-500 ${
        isSelected ? 'selected' : ''
      } ${isDimmed ? 'dimmed' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{post.author.name}</p>
          <p className="text-xs text-muted-foreground truncate">@{post.author.handle}</p>
        </div>
        <div className="bg-twitter text-white px-2 py-0.5 rounded text-xs font-bold">𝕏</div>
      </div>

      {/* Content */}
      <div className={`text-foreground ${compact ? 'text-xs' : 'text-sm'} mb-4`}>
        <p className="line-clamp-4">{post.content.text}</p>
      </div>

      {/* Engagement */}
      <div className="flex items-center gap-6 pt-3 border-t border-border text-muted-foreground">
        <div className="flex items-center gap-1.5 text-xs">
          <Heart className="w-3.5 h-3.5" />
          <span>{formatNumber(post.likes)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{formatNumber(post.comments)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Repeat2 className="w-3.5 h-3.5" />
          <span>{formatNumber(post.shares)}</span>
        </div>
      </div>
    </div>
  );
}
