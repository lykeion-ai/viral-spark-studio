import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { SocialPost } from '@/types';

interface LinkedInPostProps {
  post: SocialPost;
  isSelected?: boolean;
  isDimmed?: boolean;
  compact?: boolean;
}

export function LinkedInPost({ post, isSelected, isDimmed, compact }: LinkedInPostProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div
      className={`social-post-card linkedin-post p-4 transition-all duration-500 ${
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
        <div className="bg-linkedin text-white px-2 py-0.5 rounded text-xs font-medium">in</div>
      </div>

      {/* Content */}
      <div className={`text-foreground ${compact ? 'text-xs' : 'text-sm'} space-y-2 mb-4`}>
        {post.content.hook && (
          <p className="font-semibold">{post.content.hook}</p>
        )}
        {post.content.body && (
          <p className="text-muted-foreground line-clamp-3">{post.content.body}</p>
        )}
        {post.content.outro && (
          <p className="text-primary font-medium">{post.content.outro}</p>
        )}
      </div>

      {/* Engagement */}
      <div className="flex items-center gap-4 pt-3 border-t border-border text-muted-foreground">
        <div className="flex items-center gap-1.5 text-xs">
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{formatNumber(post.likes)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{formatNumber(post.comments)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Share2 className="w-3.5 h-3.5" />
          <span>{formatNumber(post.shares)}</span>
        </div>
      </div>
    </div>
  );
}
