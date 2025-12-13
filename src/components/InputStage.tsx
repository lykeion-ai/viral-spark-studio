import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Send } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function InputStage() {
  const { productData, setProductData, startGeneration } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProductData({ ...productData, description: e.target.value });
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
      imagePreviews: [...productData.imagePreviews, ...newPreviews],
    });
  };

  const removeImage = (index: number) => {
    const newImages = productData.images.filter((_, i) => i !== index);
    const newPreviews = productData.imagePreviews.filter((_, i) => i !== index);
    setProductData({ ...productData, images: newImages, imagePreviews: newPreviews });
  };

  const handleGenerate = () => {
    if (productData.description.trim()) {
      startGeneration();
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
          Create viral posts
        </h1>
        <p className="text-xl text-muted-foreground">
          AI-powered content for LinkedIn, X, and Instagram
        </p>
      </div>

      <div className="space-y-6">
        {/* Main Input */}
        <div className="chat-input-wrapper">
          <textarea
            value={productData.description}
            onChange={handleDescriptionChange}
            placeholder="Describe your product in 2-3 sentences... What makes it special? Who is it for?"
            className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground resize-none outline-none text-lg leading-relaxed min-h-[120px] pr-14"
            rows={4}
          />
          <button
            onClick={handleGenerate}
            disabled={!productData.description.trim()}
            className="absolute right-5 bottom-5 w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Image Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-foreground font-medium">Upload product images</p>
              <p className="text-sm text-muted-foreground mt-1">Drag and drop or click to browse</p>
            </div>
          </div>
        </div>

        {/* Image Previews */}
        {productData.imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {productData.imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden group animate-fade-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={preview}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-foreground/80 rounded-full flex items-center justify-center text-background opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-3 justify-center pt-4">
          {['SaaS product launch', 'E-commerce store', 'Mobile app', 'Personal brand'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setProductData({ ...productData, description: `I'm launching a ${suggestion.toLowerCase()}. It helps people...` })}
              className="suggestion-chip"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
