import { Sparkles, History, Settings } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { title: 'Generate', url: '/', icon: Sparkles },
  { title: 'History', url: '/history', icon: History },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  return (
    <aside className="w-14 h-screen bg-card border-r border-border flex flex-col items-center py-4 gap-2">
      {navItems.map((item) => (
        <Tooltip key={item.title} delayDuration={0}>
          <TooltipTrigger asChild>
            <NavLink
              to={item.url}
              end={item.url === '/'}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              activeClassName="bg-primary/10 text-primary"
            >
              <item.icon className="w-5 h-5" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.title}
          </TooltipContent>
        </Tooltip>
      ))}
    </aside>
  );
}
