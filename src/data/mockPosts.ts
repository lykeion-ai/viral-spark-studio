import { SocialPost } from '@/types';
import inceptionPostImage from '@/assets/inception-post.jpeg';

const avatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
];

export const linkedinPosts: SocialPost[] = [
  {
    id: 'li-1',
    platform: 'linkedin',
    author: { name: 'Sarah Chen', handle: 'sarahchen', avatar: avatars[0] },
    content: {
      hook: '🚀 I just closed a $2M funding round at 25.',
      body: 'Here\'s what nobody tells you about startup fundraising: It\'s not about the pitch deck. It\'s about the story you tell and the problem you\'re solving.',
      outro: 'What\'s your biggest fundraising lesson? Drop it below 👇'
    },
    likes: 12453,
    comments: 892,
    shares: 234,
  },
  {
    id: 'li-2',
    platform: 'linkedin',
    author: { name: 'Marcus Johnson', handle: 'marcusj', avatar: avatars[1] },
    content: {
      hook: 'I got rejected 47 times before landing my dream job.',
      body: 'Each rejection taught me something new. The 48th interview? I walked in with confidence earned through failure.',
      outro: 'Rejections are redirections. Keep going.'
    },
    likes: 8234,
    comments: 456,
    shares: 189,
  },
  {
    id: 'li-3',
    platform: 'linkedin',
    author: { name: 'Emily Rodriguez', handle: 'emilyrod', avatar: avatars[2] },
    content: {
      hook: 'Unpopular opinion: Remote work is killing creativity.',
      body: 'The best ideas happen in hallways, not Zoom calls. We need intentional spaces for serendipitous conversations.',
      outro: 'Agree or disagree? Let\'s debate 💬'
    },
    likes: 5678,
    comments: 1234,
    shares: 89,
  },
  {
    id: 'li-4',
    platform: 'linkedin',
    author: { name: 'David Park', handle: 'davidpark', avatar: avatars[3] },
    content: {
      hook: 'My CEO read this email and promoted me on the spot.',
      body: 'I didn\'t ask for a raise. I showed my impact with numbers, clear metrics, and a vision for the next quarter.',
      outro: 'Your work speaks. Make sure it\'s loud enough. 📊'
    },
    likes: 9876,
    comments: 567,
    shares: 345,
  },
  {
    id: 'li-5',
    platform: 'linkedin',
    author: { name: 'Lisa Wang', handle: 'lisawang', avatar: avatars[4] },
    content: {
      hook: '10 years ago I was making $30k. Now I run a 7-figure business.',
      body: 'The secret? I stopped trading time for money. I started building systems that work while I sleep.',
      outro: 'What system changed your life?'
    },
    likes: 15234,
    comments: 987,
    shares: 567,
  },
  {
    id: 'li-6',
    platform: 'linkedin',
    author: { name: 'Alex Thompson', handle: 'alexthompson', avatar: avatars[5] },
    content: {
      hook: 'I hired someone with zero experience. Best decision ever.',
      body: 'Skills can be taught. Attitude, hunger, and curiosity? Those are rare. Look beyond the resume.',
      outro: 'Who took a chance on you? Tag them 🙌'
    },
    likes: 7890,
    comments: 432,
    shares: 198,
  },
  {
    id: 'li-7',
    platform: 'linkedin',
    author: { name: 'Rachel Kim', handle: 'rachelkim', avatar: avatars[6] },
    content: {
      hook: 'My biggest failure made me a millionaire.',
      body: 'I lost everything at 28. Built it all back by 32. The lesson? Failure is just expensive education.',
      outro: 'Your setback is your setup. Keep building. 🏗️'
    },
    likes: 11234,
    comments: 678,
    shares: 321,
  },
  {
    id: 'li-8',
    platform: 'linkedin',
    author: { name: 'James Wilson', handle: 'jameswilson', avatar: avatars[7] },
    content: {
      hook: 'Stop networking. Start relationship building.',
      body: 'The difference? Networking is transactional. Relationships are transformational. Play the long game.',
      outro: 'Quality over quantity, always. 🤝'
    },
    likes: 6543,
    comments: 345,
    shares: 156,
  },
  {
    id: 'li-9',
    platform: 'linkedin',
    author: { name: 'Mia Foster', handle: 'miafoster', avatar: avatars[8] },
    content: {
      hook: 'I work 4 hours a day and make more than ever.',
      body: 'It\'s not about hustle. It\'s about leverage. Automate, delegate, eliminate. Focus on your genius zone.',
      outro: 'Work smarter, not harder. What do you outsource?'
    },
    likes: 13456,
    comments: 876,
    shares: 432,
  },
];

export const twitterPosts: SocialPost[] = [
  {
    id: 'tw-1',
    platform: 'twitter',
    author: { name: 'Naval', handle: 'naval', avatar: avatars[0] },
    content: { text: 'Seek wealth, not money or status. Wealth is having assets that earn while you sleep.' },
    likes: 45678,
    comments: 1234,
    shares: 8765,
  },
  {
    id: 'tw-2',
    platform: 'twitter',
    author: { name: 'Sahil Bloom', handle: 'SahilBloom', avatar: avatars[1] },
    content: { text: 'The most successful people aren\'t the smartest—they\'re the most consistent. Show up every day for 1,000 days. Then see what happens.' },
    likes: 23456,
    comments: 567,
    shares: 3456,
  },
  {
    id: 'tw-3',
    platform: 'twitter',
    author: { name: 'Alex Hormozi', handle: 'AlexHormozi', avatar: avatars[2] },
    content: { text: 'Your business doesn\'t have a lead problem. It has an offer problem. Fix the offer, fix everything.' },
    likes: 34567,
    comments: 890,
    shares: 5678,
  },
  {
    id: 'tw-4',
    platform: 'twitter',
    author: { name: 'Justin Welsh', handle: 'thejustinwelsh', avatar: avatars[3] },
    content: { text: 'I spent 10 years building someone else\'s dream. Now I spend 4 hours a day building mine. The difference? Ownership.' },
    likes: 18765,
    comments: 432,
    shares: 2345,
  },
  {
    id: 'tw-5',
    platform: 'twitter',
    author: { name: 'Dickie Bush', handle: 'dickiebush', avatar: avatars[4] },
    content: { text: 'Writing online is the most underrated skill in 2024. You build an audience, ideas, and opportunities—all at once.' },
    likes: 28765,
    comments: 654,
    shares: 4567,
  },
  {
    id: 'tw-6',
    platform: 'twitter',
    author: { name: 'Shaan Puri', handle: 'ShaanVP', avatar: avatars[5] },
    content: { text: 'The best business advice I ever got: "Be so good they can\'t ignore you." Stop pitching. Start proving.' },
    likes: 15678,
    comments: 345,
    shares: 1987,
  },
  {
    id: 'tw-7',
    platform: 'twitter',
    author: { name: 'Dan Koe', handle: 'thedankoe', avatar: avatars[6] },
    content: { text: 'Your comfort zone is killing your potential. Every day you stay comfortable, you lose a day of growth.' },
    likes: 21345,
    comments: 567,
    shares: 3210,
  },
  {
    id: 'tw-8',
    platform: 'twitter',
    author: { name: 'James Clear', handle: 'JamesClear', avatar: avatars[7] },
    content: { text: 'You do not rise to the level of your goals. You fall to the level of your systems. Build better systems.' },
    likes: 56789,
    comments: 1567,
    shares: 12345,
  },
  {
    id: 'tw-9',
    platform: 'twitter',
    author: { name: 'Tim Ferriss', handle: 'tferriss', avatar: avatars[8] },
    content: { text: 'What would this look like if it were easy? Ask yourself this before starting any project. Simplicity wins.' },
    likes: 32456,
    comments: 876,
    shares: 6543,
  },
];

export const instagramPosts: SocialPost[] = [
  {
    id: 'ig-1',
    platform: 'instagram',
    author: { name: 'entrepreneur.life', handle: 'entrepreneur.life', avatar: avatars[0] },
    content: { text: '💡 Success isn\'t about the destination, it\'s about who you become along the way. Keep grinding. 🔥 #entrepreneur #mindset #success' },
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop',
    likes: 87654,
    comments: 2345,
    shares: 5678,
  },
  {
    id: 'ig-2',
    platform: 'instagram',
    author: { name: 'startup.daily', handle: 'startup.daily', avatar: avatars[1] },
    content: { text: '📈 From garage to empire. Every big company started small. What\'s stopping you? #startup #business #motivation' },
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=400&fit=crop',
    likes: 65432,
    comments: 1876,
    shares: 4321,
  },
  {
    id: 'ig-3',
    platform: 'instagram',
    author: { name: 'hustle.culture', handle: 'hustle.culture', avatar: avatars[2] },
    content: { text: '🎯 Focus beats talent when talent doesn\'t focus. Stay locked in. #focus #discipline #grind' },
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop',
    likes: 54321,
    comments: 1543,
    shares: 3456,
  },
  {
    id: 'ig-4',
    platform: 'instagram',
    author: { name: 'wealth.mindset', handle: 'wealth.mindset', avatar: avatars[3] },
    content: { text: '💰 Rich people buy assets. Poor people buy liabilities. Know the difference. #wealth #financialfreedom #investing' },
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=400&fit=crop',
    likes: 76543,
    comments: 2134,
    shares: 5432,
  },
  {
    id: 'ig-5',
    platform: 'instagram',
    author: { name: 'morning.routine', handle: 'morning.routine', avatar: avatars[4] },
    content: { text: '🌅 Win the morning, win the day. Your routine determines your results. #morningroutine #productivity #habits' },
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop',
    likes: 98765,
    comments: 3456,
    shares: 7654,
  },
  {
    id: 'ig-6',
    platform: 'instagram',
    author: { name: 'ceo.quotes', handle: 'ceo.quotes', avatar: avatars[5] },
    content: { text: '🏆 Don\'t tell people your dreams. Show them your results. #ceo #leadership #results' },
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop',
    likes: 67890,
    comments: 1987,
    shares: 4567,
  },
  {
    id: 'ig-7',
    platform: 'instagram',
    author: { name: 'build.wealth', handle: 'build.wealth', avatar: avatars[6] },
    content: { text: '📊 Compound interest is the 8th wonder of the world. Start investing today. #compounding #wealth #finance' },
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    likes: 45678,
    comments: 1234,
    shares: 3210,
  },
  {
    id: 'ig-8',
    platform: 'instagram',
    author: { name: 'mindset.king', handle: 'mindset.king', avatar: avatars[7] },
    content: { text: '🧠 Your mind is a garden. Your thoughts are seeds. Plant positivity. #mindset #positivity #growth' },
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=400&fit=crop',
    likes: 89012,
    comments: 2678,
    shares: 6789,
  },
  {
    id: 'ig-9',
    platform: 'instagram',
    author: { name: 'success.stories', handle: 'success.stories', avatar: avatars[8] },
    content: { text: '✨ The only limit is the one you set yourself. Break free. #limitless #success #inspiration' },
    image: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400&h=400&fit=crop',
    likes: 78901,
    comments: 2345,
    shares: 5678,
  },
];

export const generatedPosts = {
  linkedin: {
    hook: "We made an AI content creation tool that just had an Inception moment.",
    body: "Your product won't sell itself, but we can make it 10x less painful to market it.\n\nWe generate viral posts about your product, brand and company. You can generate platform-native posts for Linkedin, Instagram and X in minutes.\n\nHow do you know it works? Well, you just read this post, didn't you? And guess who wrote it.",
    outro: "Read the first line again.",
    image: inceptionPostImage,
  },
  twitter: {
    text: "We made an AI content creation tool that just had an Inception moment.\n\nYour product won't sell itself, but we can make it 10x less painful to market it.\n\nWe generate viral posts about your product, brand and company. You can generate platform-native posts for Linkedin, Instagram and X in minutes.\n\nHow do you know it works? Well, you just read this post, didn't you? And guess who wrote it.\n\nRead the first line again.",
    image: inceptionPostImage,
  },
  instagram: {
    text: "We made an AI content creation tool that just had an Inception moment.\n\nYour product won't sell itself, but we can make it 10x less painful to market it.\n\nWe generate viral posts about your product, brand and company. You can generate platform-native posts for Linkedin, Instagram and X in minutes.\n\nHow do you know it works? Well, you just read this post, didn't you? And guess who wrote it.\n\nRead the first line again.",
    image: inceptionPostImage,
  },
};
