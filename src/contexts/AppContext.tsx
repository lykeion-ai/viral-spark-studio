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
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedPost>(generatedPosts);
  const [activePlatform, setActivePlatform] = useState<Platform>('linkedin');

  const startGeneration = () => {
    // Simulate API call to /generate endpoint
    setGeneratedContent(generatedPosts);
    setStage('linkedin-loading');
    
    // Auto-progress through stages
    setTimeout(() => setStage('twitter-loading'), 5000);
    setTimeout(() => setStage('instagram-loading'), 10000);
    setTimeout(() => setStage('image-loading'), 15000);
    setTimeout(() => setStage('editor'), 19000);
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
