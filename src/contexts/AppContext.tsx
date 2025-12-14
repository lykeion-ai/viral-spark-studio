import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Stage, ProductData, GeneratedPost, Platform } from '@/types';
import { generatedPosts as defaultPosts } from '@/data/mockPosts';
import { generateContent, GenerateApiResponse } from '@/lib/api';

interface AppContextType {
  stage: Stage;
  setStage: (stage: Stage) => void;
  productData: ProductData;
  setProductData: (data: ProductData) => void;
  generatedContent: GeneratedPost;
  setGeneratedContent: (content: GeneratedPost) => void;
  activePlatform: Platform;
  setActivePlatform: (platform: Platform) => void;
  startGeneration: () => void;
  isGenerating: boolean;
  generationError: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to convert API response to our GeneratedPost format
function apiResponseToGeneratedPost(response: GenerateApiResponse): GeneratedPost {
  return {
    linkedin: {
      hook: response.linkedin.hook,
      body: response.linkedin.body,
      outro: response.linkedin.outro,
      image: response.linkedin_image_url,
    },
    twitter: {
      // Combine hook, body, outro into text for Twitter/X
      text: `${response.x.hook}\n\n${response.x.body}\n\n${response.x.outro}`,
      image: response.x_image_url,
    },
    instagram: {
      // Combine hook, body, outro into text for Instagram
      text: `${response.instagram.hook}\n\n${response.instagram.body}\n\n${response.instagram.outro}`,
      image: response.instagram_image_url,
    },
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>('input');
  const [productData, setProductData] = useState<ProductData>({
    description: '',
    images: [],
    imagePreviews: [],
    selectedPlatforms: ['linkedin', 'twitter', 'instagram'],
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedPost>(defaultPosts);
  const [activePlatform, setActivePlatform] = useState<Platform>('linkedin');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const startGeneration = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setStage('linkedin-loading');

    try {
      // Start the API call
      const responsePromise = generateContent(productData.description, productData.images);

      // Progress through loading stages while API call is in flight
      // Each platform loading takes ~6s
      const stageTimers: NodeJS.Timeout[] = [];
      
      stageTimers.push(setTimeout(() => setStage('instagram-loading'), 6000));
      stageTimers.push(setTimeout(() => setStage('twitter-loading'), 12000));

      // Wait for the API response
      const response = await responsePromise;
      
      // Convert and set the generated content
      const content = apiResponseToGeneratedPost(response);
      setGeneratedContent(content);

      // Clear any remaining stage timers
      stageTimers.forEach(timer => clearTimeout(timer));

      // Move to editor stage
      setStage('editor');
    } catch (error) {
      console.error('Generation failed:', error);
      setGenerationError(error instanceof Error ? error.message : 'Generation failed');
      setStage('input');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        stage,
        setStage,
        productData,
        setProductData,
        generatedContent,
        setGeneratedContent,
        activePlatform,
        setActivePlatform,
        startGeneration,
        isGenerating,
        generationError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
