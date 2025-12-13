import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { SocialPost } from '@/types';

interface InstagramPostProps {
  post: SocialPost;
  isSelected?: boolean;
  isDimmed?: boolean;
  compact?: boolean;
}

export function InstagramPost({ post, isSelected, isDimmed, compact }: InstagramPostProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div
      className={`social-post-card instagram-post transition-all duration-500 ${
        isSelected ? 'selected' : ''
      } ${isDimmed ? 'dimmed' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <div className="p-0.5 rounded-full bg-gradient-to-tr from-instagram-orange to-instagram-pink">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-card"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{post.author.handle}</p>
        </div>
      </div>

      {/* Image */}
      {post.image && (
        <div className="aspect-square bg-secondary">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Heart className="w-5 h-5 text-foreground cursor-pointer hover:text-instagram-pink transition-colors" />
            <MessageCircle className="w-5 h-5 text-foreground cursor-pointer hover:text-muted-foreground transition-colors" />
            <Send className="w-5 h-5 text-foreground cursor-pointer hover:text-muted-foreground transition-colors" />
          </div>
          <Bookmark className="w-5 h-5 text-foreground cursor-pointer hover:text-muted-foreground transition-colors" />
        </div>

        <p className="font-semibold text-sm text-foreground mb-1">{formatNumber(post.likes)} likes</p>

        {/* Content */}
        <div className={`text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
          <span className="font-semibold mr-1">{post.author.handle}</span>
          <span className="line-clamp-2">{post.content.text}</span>
        </div>

        <p className="text-xs text-muted-foreground mt-1">View all {formatNumber(post.comments)} comments</p>
      </div>
    </div>
  );
}
