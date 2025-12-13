import { Sparkles, User } from 'lucide-react';
export function Header() {
  return <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Sparkles className="w-6 h-6 text-primary" />
          Marketly
        </a>
        
        

        <div className="hidden md:flex items-center gap-8">
          
          
          
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </nav>
    </header>;
}