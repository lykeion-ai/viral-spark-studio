import { useEffect } from 'react';
import { EditorStage } from '@/components/EditorStage';

const Edit = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background w-full">
      <EditorStage />
    </div>
  );
};

export default Edit;
