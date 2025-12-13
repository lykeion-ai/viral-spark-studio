import { Linkedin } from 'lucide-react';
import instagramIcon from '@/assets/instagram-icon.png';
import xIcon from '@/assets/x-icon.png';

const mockHistoryPosts = [
  { 
    id: 1, 
    title: 'Product Launch Announcement', 
    date: '2024-01-15', 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    preview: 'Excited to announce our latest innovation in productivity software. After months of development, we\'re ready to change how teams collaborate...' 
  },
  { 
    id: 2, 
    title: 'Q4 Results & Growth', 
    date: '2024-01-14', 
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    preview: 'Big news! Our team achieved 200% growth this quarter. Here\'s how we did it and what\'s coming next...' 
  },
  { 
    id: 3, 
    title: 'Behind the Scenes', 
    date: '2024-01-13', 
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    preview: 'Take a look at how we build products that people love. Our design process is all about iteration and user feedback...' 
  },
  { 
    id: 4, 
    title: 'Industry Insights 2024', 
    date: '2024-01-12', 
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop',
    preview: 'The future of marketing is here. AI-powered tools are transforming how brands connect with audiences...' 
  },
  { 
    id: 5, 
    title: 'Customer Success Story', 
    date: '2024-01-11', 
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
    preview: 'Our customers are amazing. Learn how TechCorp increased their engagement by 300% using our platform...' 
  },
  { 
    id: 6, 
    title: 'Team Spotlight', 
    date: '2024-01-10', 
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
    preview: 'Meet the people behind the product. Our team brings decades of combined experience in tech and design...' 
  },
];

const PlatformIcons = () => (
  <div className="flex items-center gap-1.5">
    <div className="w-6 h-6 rounded-full bg-[#0A66C2] flex items-center justify-center">
      <Linkedin className="w-3.5 h-3.5 text-white" />
    </div>
    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
      <img src={xIcon} alt="X" className="w-3.5 h-3.5 invert" />
    </div>
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E4405F] to-[#FCAF45] flex items-center justify-center">
      <img src={instagramIcon} alt="Instagram" className="w-3.5 h-3.5" />
    </div>
  </div>
);

export default function History() {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-semibold mb-6">Post History</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockHistoryPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-lg border border-border bg-card hover:shadow-md transition-all cursor-pointer overflow-hidden group"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Platform Icons - Top Right */}
              <div className="absolute top-2 right-2">
                <PlatformIcons />
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center">
                  <Linkedin className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-[10px] text-muted-foreground">{post.date}</span>
              </div>
              <h3 className="font-medium text-sm mb-1 line-clamp-1">{post.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{post.preview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
