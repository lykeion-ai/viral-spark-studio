import { Sparkles } from 'lucide-react';
export function Header() {
  return <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Sparkles className="w-6 h-6 text-primary" />
          Marketly
        </a>
        
        

        <div className="flex items-center gap-3">
          
          
        </div>
      </nav>
    </header>;
}