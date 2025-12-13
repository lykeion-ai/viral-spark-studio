import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { InputStage } from '@/components/InputStage';
import { PostLoadingStage } from '@/components/PostLoadingStage';
import { ImageLoadingStage } from '@/components/ImageLoadingStage';
import { EditorStage } from '@/components/EditorStage';

const Index = () => {
  const { stage } = useApp();

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
      case 'editor':
        return <EditorStage />;
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
