import { Linkedin, Instagram } from 'lucide-react';

const mockHistory = [
  { id: 1, platform: 'linkedin', title: 'Product Launch Announcement', date: '2024-01-15', preview: 'Excited to announce our latest innovation...' },
  { id: 2, platform: 'twitter', title: 'Quick Update', date: '2024-01-14', preview: 'Big news coming soon! Stay tuned...' },
  { id: 3, platform: 'instagram', title: 'Behind the Scenes', date: '2024-01-13', preview: 'Take a look at how we build...' },
  { id: 4, platform: 'linkedin', title: 'Industry Insights', date: '2024-01-12', preview: 'The future of marketing is here...' },
  { id: 5, platform: 'twitter', title: 'Customer Story', date: '2024-01-11', preview: 'Our customers are amazing...' },
  { id: 6, platform: 'instagram', title: 'Team Spotlight', date: '2024-01-10', preview: 'Meet the people behind...' },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'linkedin':
      return <Linkedin className="w-4 h-4 text-[#0A66C2]" />;
    case 'twitter':
      return <span className="font-bold text-sm">𝕏</span>;
    case 'instagram':
      return <Instagram className="w-4 h-4 text-[#E4405F]" />;
    default:
      return null;
  }
};

export default function History() {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-semibold mb-6">Post History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockHistory.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <PlatformIcon platform={post.platform} />
              <span className="text-xs text-muted-foreground">{post.date}</span>
            </div>
            <h3 className="font-medium mb-1">{post.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{post.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
