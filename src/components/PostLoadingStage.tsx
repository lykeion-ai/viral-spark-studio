import { useState, useEffect } from 'react';
import { Platform, SocialPost } from '@/types';
import { LinkedInPost } from './social/LinkedInPost';
import { TwitterPost } from './social/TwitterPost';
import { InstagramPost } from './social/InstagramPost';
import { linkedinPosts, twitterPosts, instagramPosts } from '@/data/mockPosts';
import { Linkedin, Twitter } from 'lucide-react';

interface PostLoadingStageProps {
  platform: Platform;
}

const platformConfig = {
  linkedin: {
    posts: linkedinPosts,
    title: 'Finding viral LinkedIn posts',
    subtitle: 'Analyzing top-performing content...',
    icon: Linkedin,
    color: 'text-linkedin',
  },
  twitter: {
    posts: twitterPosts,
    title: 'Finding viral X posts',
    subtitle: 'Scanning trending content...',
    icon: Twitter,
    color: 'text-twitter',
  },
  instagram: {
    posts: instagramPosts,
    title: 'Finding viral Instagram posts',
    subtitle: 'Discovering engaging content...',
    icon: null,
    color: 'from-instagram-pink to-instagram-orange',
  },
};

export function PostLoadingStage({ platform }: PostLoadingStageProps) {
  const [phase, setPhase] = useState<'showing' | 'selecting' | 'selected'>('showing');
  const [selectedIndices] = useState(() => {
    // Randomly select 3 indices
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, 3);
  });

  const config = platformConfig[platform];
  const posts = config.posts;

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('selecting'), 2000);
    const timer2 = setTimeout(() => setPhase('selected'), 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const renderPost = (post: SocialPost, index: number) => {
    const isSelected = selectedIndices.includes(index);
    const isDimmed = phase !== 'showing' && !isSelected;
    const shouldHide = phase === 'selected' && !isSelected;

    if (shouldHide) return null;

    const PostComponent = {
      linkedin: LinkedInPost,
      twitter: TwitterPost,
      instagram: InstagramPost,
    }[platform];

    return (
      <div
        key={post.id}
        className={`transition-all duration-700 ${
          phase === 'selecting' && isSelected ? 'animate-pulse-glow' : ''
        }`}
        style={{
          transitionDelay: `${index * 50}ms`,
        }}
      >
        <PostComponent
          post={post}
          isSelected={phase !== 'showing' && isSelected}
          isDimmed={isDimmed}
          compact
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-scale">
        <div className="flex items-center justify-center gap-3 mb-4">
          {platform === 'instagram' ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-instagram-pink to-instagram-orange flex items-center justify-center">
              <span className="text-white text-xl">📸</span>
            </div>
          ) : (
            <config.icon className={`w-10 h-10 ${config.color}`} />
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{config.title}</h2>
        <p className="text-muted-foreground">{config.subtitle}</p>
      </div>

      {/* Posts Grid */}
      <div
        className={`grid gap-4 max-w-5xl w-full transition-all duration-700 ${
          phase === 'selected'
            ? 'grid-cols-1 md:grid-cols-3 max-w-4xl'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {posts.map((post, index) => renderPost(post, index))}
      </div>

      {/* Progress indicator */}
      <div className="mt-8 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${phase === 'showing' ? 'bg-primary' : 'bg-border'}`} />
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${phase === 'selecting' ? 'bg-primary animate-pulse' : 'bg-border'}`} />
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${phase === 'selected' ? 'bg-primary' : 'bg-border'}`} />
      </div>
    </div>
  );
}
