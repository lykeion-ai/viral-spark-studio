import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { InputStage } from '@/components/InputStage';
import { PostLoadingStage } from '@/components/PostLoadingStage';
import { ImageLoadingStage } from '@/components/ImageLoadingStage';

const Index = () => {
  const { stage } = useApp();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayStage, setDisplayStage] = useState(stage);

  useEffect(() => {
    if (stage === 'editor') {
      window.scrollTo(0, 0);
      navigate('/edit');
      return;
    }

    // Start fade out
    setIsTransitioning(true);

    // Wait for fade out, then change stage
    const timer = setTimeout(() => {
      setDisplayStage(stage);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [stage, navigate]);

  const renderStage = () => {
    switch (displayStage) {
      case 'input':
        return <InputStage />;
      case 'linkedin-loading':
        return <PostLoadingStage key="linkedin" platform="linkedin" />;
      case 'instagram-loading':
        return <PostLoadingStage key="instagram" platform="instagram" />;
      case 'twitter-loading':
        return <PostLoadingStage key="twitter" platform="twitter" />;
      case 'image-loading':
        return <ImageLoadingStage />;
      default:
        return <InputStage />;
    }
  };

  return (
    <div className="min-h-full bg-background w-full">
      <div
        className={`w-full transition-opacity duration-500 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {renderStage()}
      </div>
    </div>
  );
};

export default Index;
