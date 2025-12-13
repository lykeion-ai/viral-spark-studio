import { useState, useRef, useEffect } from 'react';
import { Upload, X, Send, Linkedin, Instagram } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
const platforms = [{
  name: 'LinkedIn',
  icon: Linkedin,
  color: 'text-[#0A66C2]',
  showText: true
}, {
  name: 'X',
  icon: () => <span className="text-foreground font-bold text-5xl md:text-6xl">𝕏</span>,
  color: '',
  showText: false
}, {
  name: 'Instagram',
  icon: Instagram,
  color: 'text-[#E4405F]',
  showText: true
}];
function useTypingAnimation() {
  const [displayText, setDisplayText] = useState('');
  const [platformIndex, setPlatformIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const currentPlatform = platforms[platformIndex].name;
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = 2000;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPlatform.length) {
          setDisplayText(currentPlatform.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setPlatformIndex(prev => (prev + 1) % platforms.length);
        }
      }
    }, typingSpeed);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, platformIndex]);
  return {
    displayText,
    platformIndex
  };
}
export function InputStage() {
  const {
    productData,
    setProductData,
    startGeneration
  } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProductData({
      ...productData,
      description: e.target.value
    });
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    addImages(files);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addImages(files);
    }
  };
  const addImages = (files: File[]) => {
    const newImages = [...productData.images, ...files];
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setProductData({
      ...productData,
      images: newImages,
      imagePreviews: [...productData.imagePreviews, ...newPreviews]
    });
  };
  const removeImage = (index: number) => {
    const newImages = productData.images.filter((_, i) => i !== index);
    const newPreviews = productData.imagePreviews.filter((_, i) => i !== index);
    setProductData({
      ...productData,
      images: newImages,
      imagePreviews: newPreviews
    });
  };
  const handleGenerate = () => {
    if (productData.description.trim()) {
      startGeneration();
    }
  };

  const togglePlatform = (platform: 'linkedin' | 'twitter' | 'instagram') => {
    const current = productData.selectedPlatforms;
    if (current.includes(platform)) {
      if (current.length > 1) {
        setProductData({
          ...productData,
          selectedPlatforms: current.filter(p => p !== platform),
        });
      }
    } else {
      setProductData({
        ...productData,
        selectedPlatforms: [...current, platform],
      });
    }
  };
  const {
    displayText,
    platformIndex
  } = useTypingAnimation();
  const CurrentIcon = platforms[platformIndex].icon;
  return <main className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
          Generate a viral post for
          <br />
          <span className={`inline-flex items-center justify-center gap-2 ${platforms[platformIndex].color}`}>
            {platforms[platformIndex].showText ? displayText : null}
            <CurrentIcon className="w-12 h-12 inline-block" />
            {platforms[platformIndex].showText && <span className="animate-pulse">|</span>}
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">Create platform-native viral posts in seconds</p>
      </div>

      <div className="space-y-6">
        {/* Main Input */}
        <div className="chat-input-wrapper">
          <textarea value={productData.description} onChange={handleDescriptionChange} placeholder="Describe your product and the content of the post you want to generate." className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground resize-none outline-none text-lg leading-relaxed min-h-[120px] pr-14" rows={4} />
          <button onClick={handleGenerate} disabled={!productData.description.trim()} className="absolute right-5 bottom-5 w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105">
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Toggles */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => togglePlatform('linkedin')}
            className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
              productData.selectedPlatforms.includes('linkedin')
                ? 'bg-[#0A66C2]/10 border-[#0A66C2] text-[#0A66C2]'
                : 'border-border text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            <Linkedin className="w-5 h-5" />
          </button>
          <button
            onClick={() => togglePlatform('twitter')}
            className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
              productData.selectedPlatforms.includes('twitter')
                ? 'bg-foreground/10 border-foreground text-foreground'
                : 'border-border text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            <span className="font-bold text-base">𝕏</span>
          </button>
          <button
            onClick={() => togglePlatform('instagram')}
            className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
              productData.selectedPlatforms.includes('instagram')
                ? 'bg-[#E4405F]/10 border-[#E4405F] text-[#E4405F]'
                : 'border-border text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            <Instagram className="w-5 h-5" />
          </button>
        </div>

        {/* Image Upload Area */}
        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/50'}`}>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
          
          {productData.imagePreviews.length === 0 ? <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-foreground font-medium">Upload product images</p>
                <p className="text-sm text-muted-foreground mt-1">Drag and drop or click to browse</p>
              </div>
            </div> : <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Upload className="w-4 h-4" />
                <p className="text-sm">Click or drag to add more images</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3" onClick={e => e.stopPropagation()}>
                {productData.imagePreviews.map((preview, index) => <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden group animate-fade-scale" style={{
              animationDelay: `${index * 0.1}s`
            }}>
                    <img src={preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button onClick={e => {
                e.stopPropagation();
                removeImage(index);
              }} className="absolute inset-0 bg-foreground/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-5 h-5 text-background" />
                    </button>
                  </div>)}
              </div>
            </div>}
        </div>
      </div>
    </main>;
}