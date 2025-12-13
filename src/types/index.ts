export type Platform = 'linkedin' | 'twitter' | 'instagram';

export type Stage = 'input' | 'linkedin-loading' | 'twitter-loading' | 'instagram-loading' | 'image-loading' | 'editor';

export interface ProductData {
  description: string;
  images: File[];
  imagePreviews: string[];
  selectedPlatforms: Platform[];
}

export interface SocialPost {
  id: string;
  platform: Platform;
  author: {
    name: string;
    handle: string;
    avatar: string;
    title?: string;
  };
  content: {
    hook?: string;
    body?: string;
    outro?: string;
    text?: string;
  };
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isSelected?: boolean;
}

export interface GeneratedPost {
  linkedin: {
    hook: string;
    body: string;
    outro: string;
    image: string;
  };
  twitter: {
    text: string;
    image: string;
  };
  instagram: {
    text: string;
    image: string;
  };
}

export type HighlightType = 'hook' | 'body' | 'outro' | 'image' | 'text' | null;
