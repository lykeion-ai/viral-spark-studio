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
  { 
    id: 7, 
    title: 'New Feature Release', 
    date: '2024-01-09', 
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
    preview: 'Introducing our new AI-powered analytics dashboard. Get real-time insights into your content performance...' 
  },
  { 
    id: 8, 
    title: 'Startup Journey', 
    date: '2024-01-08', 
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
    preview: 'From idea to launch in 90 days. Here\'s the story of how we built our MVP and got our first 1000 users...' 
  },
  { 
    id: 9, 
    title: 'Marketing Tips 2024', 
    date: '2024-01-07', 
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=300&fit=crop',
    preview: '5 marketing strategies that actually work in 2024. Stop wasting time on tactics that don\'t move the needle...' 
  },
  { 
    id: 10, 
    title: 'Remote Work Culture', 
    date: '2024-01-06', 
    image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=300&fit=crop',
    preview: 'Building a world-class remote team. Our approach to async communication and maintaining company culture...' 
  },
  { 
    id: 11, 
    title: 'Product Roadmap 2024', 
    date: '2024-01-05', 
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    preview: 'Exciting things are coming this year. Here\'s a sneak peek at what we\'re building for our users...' 
  },
  { 
    id: 12, 
    title: 'Investor Update', 
    date: '2024-01-04', 
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    preview: 'We\'re thrilled to announce our Series A funding round. Here\'s what this means for our product and team...' 
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
