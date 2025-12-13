import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Stage, ProductData, GeneratedPost, Platform } from '@/types';
import { generatedPosts } from '@/data/mockPosts';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>('input');
const [productData, setProductData] = useState<ProductData>({
    description: '',
    images: [],
    imagePreviews: [],
    selectedPlatforms: ['linkedin', 'twitter', 'instagram'],
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedPost>(generatedPosts);
  const [activePlatform, setActivePlatform] = useState<Platform>('linkedin');

  const startGeneration = () => {
    // Simulate API call to /generate endpoint
    setGeneratedContent(generatedPosts);
    setStage('linkedin-loading');

    // Auto-progress through stages with new timing
    // Each platform loading takes ~9s (2.8s cycling + 1.5s analyzing + 1.8s selecting + 2.7s arranging + 0.2s buffer)
    let currentTime = 0;

    currentTime += 9000; // LinkedIn loading
    setTimeout(() => setStage('instagram-loading'), currentTime);

    currentTime += 9000; // Instagram loading
    setTimeout(() => setStage('twitter-loading'), currentTime);

    currentTime += 9000; // Twitter loading
    setTimeout(() => setStage('editor'), currentTime);
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
