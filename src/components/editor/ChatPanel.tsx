import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { HighlightType } from '@/types';
import { editContent } from '@/lib/api';
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
interface ChatPanelProps {
  onHighlightChange: (highlight: HighlightType) => void;
}
const tagColors: Record<string, string> = {
  '@hook': 'text-highlight-hook',
  '@body': 'text-highlight-body',
  '@outro': 'text-highlight-outro',
  '@image': 'text-highlight-image',
  '@text': 'text-highlight-text'
};
export function ChatPanel({
  onHighlightChange
}: ChatPanelProps) {
  const {
    activePlatform,
    generatedContent,
    setGeneratedContent
  } = useApp();
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: "Hey! Posts are ready. Just say @hook, @body, @outro or @image to tweak anything."
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect @ tags in input and highlight
  useEffect(() => {
    const tags = ['@hook', '@body', '@outro', '@image', '@text'];
    const foundTag = tags.find(tag => input.toLowerCase().includes(tag));
    if (foundTag) {
      const highlight = foundTag.replace('@', '') as HighlightType;
      onHighlightChange(highlight);
    } else {
      onHighlightChange(null);
    }
  }, [input, onHighlightChange]);
  // Get current content based on active platform
  const getCurrentContent = () => {
    if (activePlatform === 'linkedin') {
      return {
        hook: generatedContent.linkedin.hook,
        body: generatedContent.linkedin.body,
        outro: generatedContent.linkedin.outro,
        imageUrl: generatedContent.linkedin.image,
      };
    } else if (activePlatform === 'twitter') {
      // For Twitter/Instagram, we need to split the text into hook/body/outro
      // We'll use the full text as body and empty hook/outro
      const text = generatedContent.twitter.text;
      const parts = text.split('\n\n');
      return {
        hook: parts[0] || '',
        body: parts.slice(1, -1).join('\n\n') || parts[1] || '',
        outro: parts[parts.length - 1] || '',
        imageUrl: generatedContent.twitter.image,
      };
    } else {
      const text = generatedContent.instagram.text;
      const parts = text.split('\n\n');
      return {
        hook: parts[0] || '',
        body: parts.slice(1, -1).join('\n\n') || parts[1] || '',
        outro: parts[parts.length - 1] || '',
        imageUrl: generatedContent.instagram.image,
      };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    onHighlightChange(null);
    setIsLoading(true);

    try {
      const current = getCurrentContent();
      const lowerInput = input.toLowerCase();
      const hasImageTag = lowerInput.includes('@image');
      
      // Call the edit API
      const response = await editContent(
        input,
        current.hook,
        current.body,
        current.outro,
        hasImageTag ? current.imageUrl : undefined
      );

      // Update the generated content based on platform
      if (activePlatform === 'linkedin') {
        setGeneratedContent({
          ...generatedContent,
          linkedin: {
            hook: response.hook,
            body: response.body,
            outro: response.outro,
            image: response.image_url || generatedContent.linkedin.image,
          }
        });
      } else if (activePlatform === 'twitter') {
        setGeneratedContent({
          ...generatedContent,
          twitter: {
            text: `${response.hook}\n\n${response.body}\n\n${response.outro}`,
            image: response.image_url || generatedContent.twitter.image,
          }
        });
      } else {
        setGeneratedContent({
          ...generatedContent,
          instagram: {
            text: `${response.hook}\n\n${response.body}\n\n${response.outro}`,
            image: response.image_url || generatedContent.instagram.image,
          }
        });
      }

      // Generate response message
      let responseText = 'Done! I\'ve updated the content based on your instructions.';
      if (hasImageTag && response.image_url) {
        responseText = 'Done! I\'ve updated both the content and generated a new image.';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Edit failed:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const renderContent = (content: string) => {
    const parts = content.split(/(@hook|@body|@outro|@image|@text)/gi);
    return parts.map((part, index) => {
      const lowerPart = part.toLowerCase();
      if (tagColors[lowerPart]) {
        return <span key={index} className={`font-semibold ${tagColors[lowerPart]}`}>
            {part}
          </span>;
      }
      return part;
    });
  };
  const getAvailableTags = () => {
    if (activePlatform === 'linkedin') {
      return '@hook, @body, @outro, @image';
    }
    return '@text, @image';
  };

  return <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[66%] p-3 rounded-xl ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-foreground'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{renderContent(message.content)}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="chat-input-wrapper !p-3 w-full">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !isLoading && handleSend()} placeholder={activePlatform === 'linkedin' ? "e.g. @hook make it more catchy" : "e.g. @text make it more engaging"} className="flex-1 w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground pr-12" disabled={isLoading} />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>;
}