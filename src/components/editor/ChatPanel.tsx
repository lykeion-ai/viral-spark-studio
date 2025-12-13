import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { HighlightType } from '@/types';
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
    content: 'Your viral posts are ready! 🎉 You can edit any part by typing @ followed by the section name. For example:\n\n• @hook - Edit the attention-grabbing opener\n• @body - Edit the main content\n• @outro - Edit the call-to-action\n• @image - Request a new image\n\nWhat would you like to change?'
  }]);
  const [input, setInput] = useState('');
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
  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate /edit endpoint response
    setTimeout(() => {
      let responseText = '';
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('@hook')) {
        if (activePlatform === 'linkedin') {
          setGeneratedContent({
            ...generatedContent,
            linkedin: {
              ...generatedContent.linkedin,
              hook: '💥 This product just changed everything we know about the industry.'
            }
          });
          responseText = 'I\'ve updated the hook to be more impactful! The new opener creates curiosity and urgency.';
        }
      } else if (lowerInput.includes('@body')) {
        if (activePlatform === 'linkedin') {
          setGeneratedContent({
            ...generatedContent,
            linkedin: {
              ...generatedContent.linkedin,
              body: 'We spent 18 months perfecting this solution. Every feature was designed with one goal: making your life easier. Early adopters are already reporting 3x productivity gains.'
            }
          });
          responseText = 'I\'ve refined the body to include specific results and a compelling narrative.';
        }
      } else if (lowerInput.includes('@outro')) {
        if (activePlatform === 'linkedin') {
          setGeneratedContent({
            ...generatedContent,
            linkedin: {
              ...generatedContent.linkedin,
              outro: 'Ready to transform your workflow? Drop a 🚀 in the comments and I\'ll send you early access.'
            }
          });
          responseText = 'Updated the outro with a stronger call-to-action that encourages engagement!';
        }
      } else if (lowerInput.includes('@text')) {
        if (activePlatform === 'twitter') {
          setGeneratedContent({
            ...generatedContent,
            twitter: {
              ...generatedContent.twitter,
              text: 'We just shipped the feature everyone\'s been asking for. 🔥\n\nEarly users are seeing insane results.\n\nDM \"ACCESS\" to try it first.'
            }
          });
          responseText = 'I\'ve updated the tweet to be more engaging and include a clear CTA!';
        } else if (activePlatform === 'instagram') {
          setGeneratedContent({
            ...generatedContent,
            instagram: {
              ...generatedContent.instagram,
              text: '✨ NEW DROP ✨\n\nThis changes everything. Tap link in bio to get early access before everyone else.\n\n#innovation #startup #entrepreneur #business #success'
            }
          });
          responseText = 'Updated the Instagram caption with trending hashtags and urgency!';
        }
      } else if (lowerInput.includes('@image')) {
        responseText = 'I\'ll generate a new image for you. In a real implementation, this would call the AI image generation service. For now, the current image remains.';
      } else {
        responseText = 'I understand you want to make changes. Try using @ tags like @hook, @body, @outro, @text, or @image to specify which part to edit.';
      }
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 800);
    setInput('');
    onHighlightChange(null);
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
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Edit your posts</h3>
        <p className="text-sm text-muted-foreground">Available tags: {getAvailableTags()}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            
          </div>)}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="chat-input-wrapper !p-3 w-full">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={activePlatform === 'linkedin' ? "e.g. @hook make it more catchy" : "e.g. @text make it more engaging"} className="flex-1 w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground pr-12" />
          <button onClick={handleSend} disabled={!input.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>;
}