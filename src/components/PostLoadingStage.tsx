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

type AnimationPhase = 'cycling' | 'analyzing' | 'selecting' | 'arranging';

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
    // Shuffle array
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, 3);
  });

  // Track which posts are currently animating
  const [animatingIndices, setAnimatingIndices] = useState<Set<number>>(new Set());

  // Track how many times each position has been changed
  const [changeCount, setChangeCount] = useState<Map<number, number>>(new Map());

  // Track if posts have been initialized for this cycling phase
  const [postsInitialized, setPostsInitialized] = useState(false);

  // Cycling effect - fade posts in and out (staggered)
  useEffect(() => {
    if (phase !== 'cycling') {
      setPostsInitialized(false); // Reset for next cycling phase
      return;
    }

    // Start with random posts only once when entering cycling phase
    if (!postsInitialized) {
      const shuffled = [...allPosts].sort(() => Math.random() - 0.5);
      setDisplayedPosts(shuffled.slice(0, numPosts));
      setPostsInitialized(true);
    }

    // Start first cycle immediately
    const executeCycle = () => {
      // Only execute if still in cycling phase
      if (phase !== 'cycling') return;

      setDisplayedPosts(currentPosts => {
        const newPosts = [...currentPosts];

        // Find positions that can still be changed (max 2 times each)
        const availableIndices = Array.from({ length: numPosts }, (_, i) => i)
          .filter(i => (changeCount.get(i) || 0) < 2);

        if (availableIndices.length === 0) return currentPosts;

        // Change at least 70% of all posts (or as many as available)
        const targetChangeCount = Math.ceil(numPosts * 0.7); // 70% of posts
        const numToChange = Math.min(targetChangeCount, availableIndices.length);

        // Randomly select indices from available ones
        const shuffledAvailable = [...availableIndices].sort(() => Math.random() - 0.5);
        const indicesToChange = shuffledAvailable.slice(0, numToChange);

        // Split into 3-4 batches for staggered animation
        const numBatches = Math.min(4, Math.max(3, Math.ceil(indicesToChange.length / 2)));
        const batchSize = Math.ceil(indicesToChange.length / numBatches);
        const batches: number[][] = [];

        for (let i = 0; i < numBatches; i++) {
          const start = i * batchSize;
          const end = Math.min(start + batchSize, indicesToChange.length);
          if (start < indicesToChange.length) {
            batches.push(indicesToChange.slice(start, end));
          }
        }

        // Animate batches with staggered delays (150ms between each batch start)
        batches.forEach((batch, batchIndex) => {
          setTimeout(() => {
            // Set animating indices for this batch
            setAnimatingIndices(prev => {
              const newSet = new Set(prev);
              batch.forEach(index => newSet.add(index));
              return newSet;
            });

            // Update change count for this batch
            setChangeCount(prev => {
              const newCount = new Map(prev);
              batch.forEach(index => {
                newCount.set(index, (newCount.get(index) || 0) + 1);
              });
              return newCount;
            });

            // Clear animating indices for this batch after animation completes
            setTimeout(() => {
              setAnimatingIndices(prev => {
                const newSet = new Set(prev);
                batch.forEach(index => newSet.delete(index));
                return newSet;
              });
            }, 2000);
          }, batchIndex * 150); // 150ms delay between batch starts
        });

        // Replace posts with new random ones (all at once, but animation is staggered)
        indicesToChange.forEach(index => {
          const unusedPosts = allPosts.filter(p => !newPosts.some(np => np.id === p.id));
          if (unusedPosts.length > 0) {
            newPosts[index] = unusedPosts[Math.floor(Math.random() * unusedPosts.length)];
          } else {
            newPosts[index] = allPosts[Math.floor(Math.random() * allPosts.length)];
          }
        });

        return newPosts;
      });
    };

    // Execute first cycle immediately
    executeCycle();

    // Then continue with interval (2700ms to allow last batch animation to complete)
    // Last batch starts at 450ms and takes 2000ms, so completes at 2450ms
    const interval = setInterval(executeCycle, 2700);

    return () => clearInterval(interval);
  }, [phase, allPosts, numPosts]);

  useEffect(() => {
    // Phase 1: Cycling (0-2.8s) - allows one complete cycle to finish
    const timer1 = setTimeout(() => {
      setPhase('analyzing');
      // Keep the posts that are already on screen
    }, 2800);

    // Phase 2: Analyzing (2.8-4.3s)
    const timer2 = setTimeout(() => {
      setPhase('selecting');
      // Start selecting posts one by one
      selectedIndices.forEach((index, i) => {
        setTimeout(() => setCurrentlySelecting(index), i * 600);
      });
    }, 4300);

    // Phase 3: Selecting (4.3-6.1s)
    const timer3 = setTimeout(() => {
      setPhase('arranging');
      setCurrentlySelecting(-1);
    }, 6100);

    // Phase 4: Arranging continues for longer (6.1-8.8s = 2.7s to view)

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const renderPost = (post: SocialPost, index: number) => {
    const isSelected = selectedIndices.includes(index);
    const isCurrentlySelecting = currentlySelecting === index;
    const shouldFadeOut = phase === 'arranging' && !isSelected;
    const shouldFadeOutSelected = phase === 'arranging' && isSelected;
    const isDimmed = phase === 'selecting' && !isSelected;
    const isAnimating = animatingIndices.has(index);

    const PostComponent = {
      linkedin: LinkedInPost,
      twitter: TwitterPost,
      instagram: InstagramPost,
    }[platform];

    return (
      <div
        key={`${post.id}-${index}`}
        className={`transition-all duration-700 ease-in-out ${
          phase === 'cycling' && isAnimating ? 'animate-fade-in-out' : ''
        } ${
          isCurrentlySelecting ? `ring-4 ${config.circleColor} scale-105 shadow-2xl` : ''
        } ${
          shouldFadeOut ? 'opacity-0 scale-95 pointer-events-none' : ''
        } ${
          shouldFadeOutSelected ? 'opacity-0 transition-opacity duration-1000 delay-500' : 'opacity-100'
        }`}
        style={{
          transitionDelay: shouldFadeOut ? `${index * 30}ms` : undefined,
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
        return {
          title: 'Extracting viral patterns',
          subtitle: `Analyzing key elements from ${config.name} posts...`,
          icon: <Sparkles className="w-5 h-5 text-primary" />,
        };
    }
  };

  const phaseMessage = getPhaseMessage();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12 w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
            <config.icon className={`w-7 h-7 ${config.color}`} />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{phaseMessage.title}</h2>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          {phaseMessage.icon}
          <span>{phaseMessage.subtitle}</span>
        </p>
      </div>

      {/* Posts Grid or Row */}
      <div
        className={`transition-all duration-1000 ease-in-out w-full grid gap-3 max-w-6xl ${
          platform === 'instagram'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
        style={{
          transform: platform === 'instagram' ? 'scale(0.6)' : 'scale(0.75)',
          transformOrigin: 'top center',
        }}
      >
        {displayedPosts.map((post, index) => renderPost(post, index))}
      </div>

      {/* Progress indicator */}
      <div className="mt-8 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${phase === 'cycling' ? 'bg-primary animate-pulse' : 'bg-primary/30'}`} />
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${phase === 'analyzing' ? 'bg-primary animate-pulse' : phase !== 'cycling' ? 'bg-primary/30' : 'bg-border'}`} />
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${phase === 'selecting' ? 'bg-primary animate-pulse' : phase === 'arranging' ? 'bg-primary/30' : 'bg-border'}`} />
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${phase === 'arranging' ? 'bg-primary animate-pulse' : 'bg-border'}`} />
      </div>
    </div>
  );
}
