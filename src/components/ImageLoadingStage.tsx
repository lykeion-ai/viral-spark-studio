import { useApp } from '@/contexts/AppContext';
import { Sparkles } from 'lucide-react';

export function ImageLoadingStage() {
  const { productData } = useApp();
  
  // Use up to 5 images for the animation
  const images = productData.imagePreviews.slice(0, 5);
  
  // If no images uploaded, use placeholder
  const displayImages = images.length > 0 
    ? images 
    : [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
      ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Header */}
      <div className="text-center mb-16 animate-fade-scale">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Analyzing your product images
        </h2>
        <p className="text-muted-foreground">Creating personalized visuals for your posts...</p>
      </div>

      {/* Orbiting Images */}
      <div className="relative w-72 h-72">
        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse" />
          <div className="absolute w-24 h-24 rounded-full bg-primary/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-32 h-32 rounded-full bg-primary/5 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Orbiting images */}
        {displayImages.map((image, index) => {
          const angle = (360 / displayImages.length) * index;
          const delay = index * 0.5;
          
          return (
            <div
              key={index}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                animation: `orbit 8s linear infinite`,
                animationDelay: `-${delay}s`,
                transformOrigin: '0 0',
              }}
            >
              <div
                className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-card animate-float"
                style={{
                  transform: `rotate(${angle}deg) translateX(100px) rotate(-${angle}deg)`,
                  animationDelay: `${delay}s`,
                }}
              >
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading dots */}
      <div className="mt-16 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}
