import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { InputStage } from '@/components/InputStage';
import { PostLoadingStage } from '@/components/PostLoadingStage';
import { ImageLoadingStage } from '@/components/ImageLoadingStage';

const Index = () => {
  const { stage } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (stage === 'editor') {
      navigate('/edit');
    }
  }, [stage, navigate]);

  const renderStage = () => {
    switch (stage) {
      case 'input':
        return <InputStage />;
      case 'linkedin-loading':
        return <PostLoadingStage platform="linkedin" />;
      case 'twitter-loading':
        return <PostLoadingStage platform="twitter" />;
      case 'instagram-loading':
        return <PostLoadingStage platform="instagram" />;
      case 'image-loading':
        return <ImageLoadingStage />;
      default:
        return <InputStage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {renderStage()}
    </div>
  );
};

export default Index;
