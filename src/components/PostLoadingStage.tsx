import { useState, useEffect } from 'react';
import { Platform, SocialPost } from '@/types';
import { LinkedInPost } from './social/LinkedInPost';
import { TwitterPost } from './social/TwitterPost';
import { InstagramPost } from './social/InstagramPost';
import { linkedinPosts, twitterPosts, instagramPosts } from '@/data/mockPosts';
import { Linkedin, Twitter, Sparkles, TrendingUp, Instagram } from 'lucide-react';

interface PostLoadingStageProps {
  platform: Platform;
}

const platformConfig = {
  linkedin: {
    posts: linkedinPosts,
    icon: Linkedin,
    color: 'text-linkedin',
    bgColor: 'bg-linkedin/10',
    circleColor: 'ring-linkedin shadow-linkedin/50',
    name: 'LinkedIn',
  },
  twitter: {
    posts: twitterPosts,
    icon: Twitter,
    color: 'text-twitter',
    bgColor: 'bg-twitter/10',
    circleColor: 'ring-twitter shadow-twitter/50',
    name: 'X',
  },
  instagram: {
    posts: instagramPosts,
    icon: Instagram,
    color: 'from-instagram-pink to-instagram-orange',
    bgColor: 'bg-gradient-to-tr from-instagram-pink/10 to-instagram-orange/10',
    circleColor: 'ring-2 ring-instagram-pink shadow-instagram-pink/50',
    name: 'Instagram',
  },
};

type AnimationPhase = 'cycling' | 'analyzing' | 'selecting' | 'showcasing' | 'fading';

export function PostLoadingStage({ platform }: PostLoadingStageProps) {
  const [phase, setPhase] = useState<AnimationPhase>('cycling');
  const [currentlySelecting, setCurrentlySelecting] = useState<number>(-1);
  const [displayedPosts, setDisplayedPosts] = useState<SocialPost[]>([]);

  const config = platformConfig[platform];
  const allPosts = config.posts;

  // Instagram shows 6 posts (2x3), others show 9 posts (3x3)
  const numPosts = platform === 'instagram' ? 6 : 9;

  // Always select 3 posts for all platforms
  const [selectedIndices] = useState(() => {
    const indices = Array.from({ length: numPosts }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, 3);
  });

  // Track which posts are currently animating
  const [animatingIndices, setAnimatingIndices] = useState<Set<number>>(new Set());

  // Initialize posts once
  const [postsInitialized, setPostsInitialized] = useState(false);

  // Initialize posts once at the start
  useEffect(() => {
    if (!postsInitialized) {
      const shuffled = [...allPosts].sort(() => Math.random() - 0.5);
      setDisplayedPosts(shuffled.slice(0, numPosts));
      setPostsInitialized(true);
    }
  }, [allPosts, numPosts, postsInitialized]);

  // Cycling animation - only visual, no post changes
  useEffect(() => {
    if (phase !== 'cycling' || !postsInitialized) return;

    const animateCycle = () => {
      const indicesToAnimate = Array.from({ length: numPosts }, (_, i) => i)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.ceil(numPosts * 0.5));

      setAnimatingIndices(new Set(indicesToAnimate));

      setTimeout(() => {
        setAnimatingIndices(new Set());
      }, 800);
    };

    animateCycle();
    const interval = setInterval(animateCycle, 1200);

    return () => clearInterval(interval);
  }, [phase, numPosts, postsInitialized]);

  // Phase transitions
  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('analyzing'), 2800);
    
    const timer2 = setTimeout(() => {
      setPhase('selecting');
      selectedIndices.forEach((index, i) => {
        setTimeout(() => setCurrentlySelecting(index), i * 500);
      });
    }, 4300);

    // Fade out non-selected, keep selected visible
    const timer3 = setTimeout(() => {
      setPhase('showcasing');
      setCurrentlySelecting(-1);
    }, 6000);

    // Fade out selected posts
    const timer4 = setTimeout(() => setPhase('fading'), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [selectedIndices]);

  const renderPost = (post: SocialPost, index: number) => {
    const isSelected = selectedIndices.includes(index);
    const isCurrentlySelecting = currentlySelecting === index;
    const isDimmed = phase === 'selecting' && !isSelected;
    const isAnimating = animatingIndices.has(index);
    
    // Non-selected posts fade out during showcasing
    const shouldFadeOutNonSelected = (phase === 'showcasing' || phase === 'fading') && !isSelected;
    // Selected posts fade out during fading phase
    const shouldFadeOutSelected = phase === 'fading' && isSelected;

    const PostComponent = {
      linkedin: LinkedInPost,
      twitter: TwitterPost,
      instagram: InstagramPost,
    }[platform];

    return (
      <div
        key={`${post.id}-${index}`}
        className={`
          transition-opacity ease-out duration-700
          ${shouldFadeOutNonSelected ? 'opacity-0 pointer-events-none' : ''}
          ${shouldFadeOutSelected ? 'opacity-0' : ''}
          ${!shouldFadeOutNonSelected && !shouldFadeOutSelected ? 'opacity-100' : ''}
          ${phase === 'cycling' && isAnimating ? 'shadow-lg' : ''}
        `}
      >
        <PostComponent
          post={post}
          isSelected={false}
          isDimmed={isDimmed}
          compact
        />
      </div>
    );
  };

  const getPhaseMessage = () => {
    switch (phase) {
      case 'cycling':
        return {
          title: 'Finding top viral posts',
          subtitle: `Scanning ${config.name} for high-engagement content...`,
          icon: <TrendingUp className="w-5 h-5 animate-pulse" />,
        };
      case 'analyzing':
        return {
          title: 'Analyzing viral posts',
          subtitle: 'Evaluating engagement metrics and content patterns...',
          icon: <Sparkles className="w-5 h-5 animate-spin" />,
        };
      case 'selecting':
        return {
          title: 'Taking top posts that will help the most',
          subtitle: 'Selecting viral content to enhance your prompt and images...',
          icon: <Sparkles className="w-5 h-5 text-primary animate-pulse" />,
        };
      case 'showcasing':
        return {
          title: 'Extracting viral patterns',
          subtitle: `Analyzing key elements from ${config.name} posts...`,
          icon: <Sparkles className="w-5 h-5 text-primary" />,
        };
      case 'fading':
        return {
          title: 'Patterns extracted',
          subtitle: `Moving to next platform...`,
          icon: <Sparkles className="w-5 h-5 text-primary" />,
        };
    }
  };

  const phaseMessage = getPhaseMessage();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-start px-6 py-8 w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center transition-transform duration-500 ${phase === 'analyzing' ? 'scale-110' : ''}`}>
            <config.icon className={`w-7 h-7 ${config.color}`} />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 transition-all duration-300">{phaseMessage.title}</h2>
        <p className="text-muted-foreground flex items-center justify-center gap-2 transition-all duration-300">
          {phaseMessage.icon}
          <span>{phaseMessage.subtitle}</span>
        </p>
      </div>

      {/* Posts Grid */}
      <div
        className={`w-full max-w-6xl grid gap-3 ${
          platform === 'instagram'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
        style={{
          transform: platform === 'instagram' ? 'scale(0.5)' : 'scale(0.7)',
          transformOrigin: 'top center',
          marginTop: platform === 'instagram' ? '1rem' : '0',
        }}
      >
        {displayedPosts.map((post, index) => renderPost(post, index))}
      </div>

    </div>
  );
}
