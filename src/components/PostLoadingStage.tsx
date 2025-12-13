import { useState, useEffect, useRef, useCallback } from 'react';
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

type AnimationPhase = 'cycling' | 'analyzing' | 'selecting' | 'arranging' | 'showcasing' | 'fading';

export function PostLoadingStage({ platform }: PostLoadingStageProps) {
  const [phase, setPhase] = useState<AnimationPhase>('cycling');
  const [currentlySelecting, setCurrentlySelecting] = useState<number>(-1);
  const [displayedPosts, setDisplayedPosts] = useState<SocialPost[]>([]);
  const [postTransforms, setPostTransforms] = useState<Map<number, { x: number; y: number }>>(new Map());

  const config = platformConfig[platform];
  const allPosts = config.posts;

  // Instagram shows 6 posts (2x3), others show 9 posts (3x3)
  const numPosts = platform === 'instagram' ? 6 : 9;

  // Refs for measuring positions
  const gridRef = useRef<HTMLDivElement>(null);
  const postRefs = useRef<Map<number, HTMLDivElement>>(new Map());

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

  // Calculate transforms to move selected posts to center
  const calculateCenterTransforms = useCallback(() => {
    if (!gridRef.current) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const gridCenterX = gridRect.width / 2;
    
    const transforms = new Map<number, { x: number; y: number }>();
    const selectedRects: { index: number; rect: DOMRect }[] = [];

    // Get positions of selected posts
    selectedIndices.forEach((index) => {
      const el = postRefs.current.get(index);
      if (el) {
        selectedRects.push({ index, rect: el.getBoundingClientRect() });
      }
    });

    if (selectedRects.length === 0) return;

    // Calculate total width of selected posts with gaps
    const gap = 16;
    const totalWidth = selectedRects.reduce((sum, { rect }) => sum + rect.width, 0) + gap * (selectedRects.length - 1);
    
    // Starting X position for centered row
    let currentX = gridCenterX - totalWidth / 2;
    
    // Target Y - use the first row's Y position
    const firstRowY = selectedRects[0].rect.top - gridRect.top;

    selectedRects.forEach(({ index, rect }) => {
      const currentCenterX = rect.left - gridRect.left + rect.width / 2;
      const currentY = rect.top - gridRect.top;
      
      const targetCenterX = currentX + rect.width / 2;
      const targetY = firstRowY;

      transforms.set(index, {
        x: targetCenterX - currentCenterX,
        y: targetY - currentY,
      });

      currentX += rect.width + gap;
    });

    setPostTransforms(transforms);
  }, [selectedIndices]);

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

    // Create a subtle cycling animation effect
    const animateCycle = () => {
      // Randomly select some posts to animate
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

    const timer3 = setTimeout(() => {
      setPhase('arranging');
      setCurrentlySelecting(-1);
    }, 6000);

    const timer4 = setTimeout(() => {
      calculateCenterTransforms();
      setPhase('showcasing');
    }, 7000);

    const timer5 = setTimeout(() => setPhase('fading'), 8800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [calculateCenterTransforms, selectedIndices]);

  const setPostRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) {
      postRefs.current.set(index, el);
    } else {
      postRefs.current.delete(index);
    }
  }, []);

  const renderPost = (post: SocialPost, index: number) => {
    const isSelected = selectedIndices.includes(index);
    const isCurrentlySelecting = currentlySelecting === index;
    const isDimmed = phase === 'selecting' && !isSelected;
    const isAnimating = animatingIndices.has(index);
    
    const shouldFadeOut = (phase === 'arranging' || phase === 'showcasing' || phase === 'fading') && !isSelected;
    const shouldMoveToCenter = (phase === 'showcasing' || phase === 'fading') && isSelected;
    const shouldFadeOutFinal = phase === 'fading' && isSelected;

    const PostComponent = {
      linkedin: LinkedInPost,
      twitter: TwitterPost,
      instagram: InstagramPost,
    }[platform];

    const transform = shouldMoveToCenter && postTransforms.has(index)
      ? postTransforms.get(index)
      : null;

    return (
      <div
        key={`${post.id}-${index}`}
        ref={(el) => setPostRef(index, el)}
        className={`
          transition-all ease-out
          ${shouldFadeOut ? 'duration-500 opacity-0 scale-95 pointer-events-none' : ''}
          ${shouldMoveToCenter ? 'duration-1000 z-10' : 'duration-500'}
          ${shouldFadeOutFinal ? 'opacity-0 scale-95' : ''}
          ${!shouldFadeOut && !shouldFadeOutFinal ? 'opacity-100' : ''}
          ${phase === 'cycling' && isAnimating ? 'scale-[1.02] shadow-lg' : ''}
          ${isCurrentlySelecting ? `ring-4 ${config.circleColor} scale-105 shadow-2xl z-20` : ''}
        `}
        style={{
          transform: transform 
            ? `translate(${transform.x}px, ${transform.y}px)` 
            : undefined,
          transitionTimingFunction: shouldMoveToCenter ? 'cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
        }}
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
      case 'arranging':
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
        ref={gridRef}
        className={`w-full max-w-6xl grid gap-3 ${
          platform === 'instagram'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
        style={{
          transform: platform === 'instagram' ? 'scale(0.55)' : 'scale(0.7)',
          transformOrigin: 'top center',
          marginTop: platform === 'instagram' ? '-2rem' : '0',
        }}
      >
        {displayedPosts.map((post, index) => renderPost(post, index))}
      </div>

      {/* Progress indicator */}
      <div className="mt-6 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${phase === 'cycling' ? 'bg-primary scale-125' : 'bg-primary/30'}`} />
        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${phase === 'analyzing' ? 'bg-primary scale-125' : phase !== 'cycling' ? 'bg-primary/30' : 'bg-border'}`} />
        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${phase === 'selecting' ? 'bg-primary scale-125' : ['arranging', 'showcasing', 'fading'].includes(phase) ? 'bg-primary/30' : 'bg-border'}`} />
        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${['arranging', 'showcasing', 'fading'].includes(phase) ? 'bg-primary scale-125' : 'bg-border'}`} />
      </div>
    </div>
  );
}