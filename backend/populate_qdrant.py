"""
Script to populate Qdrant with LinkedIn posts from the linkedin_dataset directory

Usage:
    1. Add your LinkedIn posts as .txt files in backend/linkedin_dataset/
    2. Each file should contain one complete LinkedIn post
    3. Run: python populate_qdrant.py
    
The script will:
    - Load all .txt files from linkedin_dataset/
    - Parse each post into hook, body, and outro
    - Create embeddings and upload to Qdrant
    - Also include sample X and Instagram posts
"""

import os
import asyncio
from typing import List, Dict
from pathlib import Path
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# Load environment variables
load_dotenv()


def load_linkedin_posts_from_dataset(dataset_dir: str = "linkedin_dataset") -> List[Dict]:
    """
    Load LinkedIn posts from the linkedin_dataset directory.
    Each .txt file contains one LinkedIn post.
    """
    script_dir = Path(__file__).parent
    dataset_path = script_dir / dataset_dir
    
    if not dataset_path.exists():
        print(f"⚠️  Warning: Dataset directory '{dataset_path}' not found")
        return []
    
    linkedin_posts = []
    txt_files = sorted(dataset_path.glob("*.txt"))
    
    if not txt_files:
        print(f"⚠️  Warning: No .txt files found in '{dataset_path}'")
        return []
    
    print(f"📁 Loading {len(txt_files)} LinkedIn posts from {dataset_dir}/")
    
    for txt_file in txt_files:
        try:
            with open(txt_file, 'r', encoding='utf-8') as f:
                text = f.read().strip()
            
            if not text:
                print(f"  ⚠️  Skipping empty file: {txt_file.name}")
                continue
            
            # Split post into hook, body, and outro
            # Hook: First paragraph (up to first double newline or first 2 lines)
            # Body: Middle paragraphs
            # Outro: Last paragraph (usually contains question or CTA)
            
            paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
            
            if len(paragraphs) == 0:
                # Single paragraph post - split by lines
                lines = [l.strip() for l in text.split('\n') if l.strip()]
                if len(lines) >= 3:
                    hook = lines[0]
                    body = '\n'.join(lines[1:-1])
                    outro = lines[-1]
                elif len(lines) == 2:
                    hook = lines[0]
                    body = ""
                    outro = lines[1]
                else:
                    hook = text
                    body = ""
                    outro = ""
            elif len(paragraphs) == 1:
                # Single paragraph - use first line as hook, last line as outro
                lines = [l.strip() for l in paragraphs[0].split('\n') if l.strip()]
                if len(lines) >= 3:
                    hook = lines[0]
                    body = '\n'.join(lines[1:-1])
                    outro = lines[-1]
                else:
                    hook = paragraphs[0]
                    body = ""
                    outro = ""
            elif len(paragraphs) == 2:
                # Two paragraphs - first is hook, second is body+outro
                hook = paragraphs[0]
                lines = [l.strip() for l in paragraphs[1].split('\n') if l.strip()]
                if len(lines) >= 2:
                    body = '\n'.join(lines[:-1])
                    outro = lines[-1]
                else:
                    body = paragraphs[1]
                    outro = ""
            else:
                # Multiple paragraphs - first is hook, last is outro, rest is body
                hook = paragraphs[0]
                outro = paragraphs[-1]
                body = '\n\n'.join(paragraphs[1:-1])
            
            post = {
                "text": text,
                "platform": "linkedin",
                "hook": hook,
                "body": body,
                "outro": outro,
                "engagement": 0.0,  # No engagement data available
                "source_file": txt_file.name,
            }
            
            linkedin_posts.append(post)
            print(f"  ✅ Loaded: {txt_file.name}")
            
        except Exception as e:
            print(f"  ❌ Error loading {txt_file.name}: {e}")
            continue
    
    print(f"\n✅ Successfully loaded {len(linkedin_posts)} LinkedIn posts\n")
    return linkedin_posts

SAMPLE_X_POSTS = [
    {
        "text": "Shipped our AI analytics tool. 4 hours → 4 minutes. Beta users are seeing 3x faster decisions. The future of data is instant insights, not endless dashboards. 📊⚡",
        "platform": "x",
        "hook": "Shipped our AI analytics tool.",
        "body": "4 hours → 4 minutes. Beta users are seeing 3x faster decisions.",
        "outro": "The future of data is instant insights, not endless dashboards. 📊⚡",
        "engagement": 850.0,
    },
    {
        "text": "Stop chasing impressions. Start building community. 100 engaged followers beat 10,000 passive scrollers every time. Marketing isn't about reach—it's about resonance. 🎯",
        "platform": "x",
        "hook": "Stop chasing impressions. Start building community.",
        "body": "100 engaged followers beat 10,000 passive scrollers every time.",
        "outro": "Marketing isn't about reach—it's about resonance. 🎯",
        "engagement": 1200.0,
    },
    {
        "text": "We almost shut down 3 years ago. Hit $5M ARR today. The secret? Learning to say no. Focus isn't sexy, but it's profitable. 💪",
        "platform": "x",
        "hook": "We almost shut down 3 years ago. Hit $5M ARR today.",
        "body": "The secret? Learning to say no.",
        "outro": "Focus isn't sexy, but it's profitable. 💪",
        "engagement": 2100.0,
    },
]

SAMPLE_INSTAGRAM_POSTS = [
    {
        "text": """🚀 From 4 hours to 4 minutes ⏰

We just launched AI-powered analytics that's changing how teams work with data ✨

Beta users told us they didn't just want speed—they wanted clarity. So we built smart recommendations that highlight what actually matters 💡

Now teams are making decisions 3x faster and feeling way more confident about them 📊

The tech industry moves fast, but your tools should move faster 🔥

Drop a 💙 if you've ever spent hours on a report that could've been automated!

What's the most time-consuming task in your workday? Tell us in the comments 👇

#ProductivityHacks #AITools #WorkSmarter #TechInnovation #StartupLife #DataAnalytics #TimeManagement #FutureOfWork""",
        "platform": "instagram",
        "hook": "🚀 From 4 hours to 4 minutes ⏰",
        "body": "We just launched AI-powered analytics that's changing how teams work with data ✨\n\nBeta users told us they didn't just want speed—they wanted clarity. So we built smart recommendations that highlight what actually matters 💡\n\nNow teams are making decisions 3x faster and feeling way more confident about them 📊\n\nThe tech industry moves fast, but your tools should move faster 🔥\n\nDrop a 💙 if you've ever spent hours on a report that could've been automated!",
        "outro": "What's the most time-consuming task in your workday? Tell us in the comments 👇\n\n#ProductivityHacks #AITools #WorkSmarter #TechInnovation #StartupLife #DataAnalytics #TimeManagement #FutureOfWork",
        "engagement": 3200.0,
    },
    {
        "text": """Real talk: Most marketing advice is wrong 🎯

Everyone's chasing viral moments and huge follower counts. But here's what actually matters... 👇

QUALITY > QUANTITY

100 people who genuinely care about your brand will always outperform 10,000 random followers 💪

We built a $10M company by focusing on deep connections, not wide reach ✨

The shift we made:
✅ Real conversations over broadcasts
✅ Community building over content spraying
✅ Engagement over impressions

Your audience wants to feel seen, heard, and valued. Give them that 💙

Save this post if you needed this reminder today 📱

Tag a founder who needs to hear this! 👋

#MarketingTips #StartupAdvice #CommunityBuilding #SocialMediaMarketing #BusinessGrowth #EntrepreneurLife #ContentStrategy #DigitalMarketing""",
        "platform": "instagram",
        "hook": "Real talk: Most marketing advice is wrong 🎯",
        "body": "Everyone's chasing viral moments and huge follower counts. But here's what actually matters... 👇\n\nQUALITY > QUANTITY\n\n100 people who genuinely care about your brand will always outperform 10,000 random followers 💪\n\nWe built a $10M company by focusing on deep connections, not wide reach ✨\n\nThe shift we made:\n✅ Real conversations over broadcasts\n✅ Community building over content spraying\n✅ Engagement over impressions\n\nYour audience wants to feel seen, heard, and valued. Give them that 💙\n\nSave this post if you needed this reminder today 📱",
        "outro": "Tag a founder who needs to hear this! 👋\n\n#MarketingTips #StartupAdvice #CommunityBuilding #SocialMediaMarketing #BusinessGrowth #EntrepreneurLife #ContentStrategy #DigitalMarketing",
        "engagement": 4100.0,
    },
]


def create_dummy_embedding(text: str, size: int = 1536) -> List[float]:
    """
    Create a dummy embedding vector for demonstration.
    In production, replace this with actual embedding generation using:
    - OpenAI embeddings API
    - Sentence transformers
    - Cohere embeddings
    - etc.
    """
    import hashlib
    import struct
    
    # Create deterministic "embedding" from text hash
    # This is just for demonstration - use real embeddings in production!
    hash_bytes = hashlib.sha256(text.encode()).digest()
    
    # Generate pseudo-random vector from hash
    vector = []
    for i in range(size):
        # Use hash to seed values
        idx = (i * 16) % len(hash_bytes)
        value = struct.unpack('f', hash_bytes[idx:idx+4] + b'\x00' * (4 - min(4, len(hash_bytes) - idx)))[0]
        vector.append(value)
    
    # Normalize to unit vector
    magnitude = sum(x * x for x in vector) ** 0.5
    if magnitude > 0:
        vector = [x / magnitude for x in vector]
    
    return vector


async def populate_qdrant():
    """Populate Qdrant with LinkedIn posts from dataset and sample X/Instagram posts."""
    
    # Get Qdrant client
    qdrant_api_key = os.getenv("QDRANT_API_KEY")
    qdrant_url = os.getenv("QDRANT_URL", "https://a8f15c78-eed9-4352-b360-cc39bddf7d45.eu-central-1-0.aws.cloud.qdrant.io:6333")
    collection_name = os.getenv("QDRANT_COLLECTION_NAME", "social_media_posts")
    
    if not qdrant_api_key:
        print("❌ Error: QDRANT_API_KEY not set in environment variables")
        print("Please add QDRANT_API_KEY to your .env file")
        return
    
    print(f"🔗 Connecting to Qdrant at {qdrant_url}...")
    client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
    
    # Check if collection exists
    collections = client.get_collections()
    collection_names = [col.name for col in collections.collections]
    
    if collection_name in collection_names:
        print(f"⚠️  Collection '{collection_name}' already exists")
        response = input("Do you want to delete and recreate it? (yes/no): ")
        if response.lower() == 'yes':
            client.delete_collection(collection_name)
            print(f"🗑️  Deleted existing collection '{collection_name}'")
        else:
            print("Keeping existing collection. Exiting.")
            return
    
    # Create collection
    print(f"📦 Creating collection '{collection_name}'...")
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(
            size=1536,  # Standard size for many embedding models
            distance=Distance.COSINE,
        ),
    )
    print(f"✅ Collection '{collection_name}' created successfully")
    
    # Load LinkedIn posts from dataset directory
    linkedin_posts = load_linkedin_posts_from_dataset("linkedin_dataset")
    
    if not linkedin_posts:
        print("❌ No LinkedIn posts loaded from dataset. Exiting.")
        return
    
    # Prepare all posts (LinkedIn from dataset + sample X and Instagram posts)
    all_posts = linkedin_posts + SAMPLE_X_POSTS + SAMPLE_INSTAGRAM_POSTS
    
    # Add posts to collection
    print(f"\n📝 Adding {len(all_posts)} sample posts...")
    points = []
    
    for idx, post in enumerate(all_posts):
        # Generate embedding (replace with real embeddings in production)
        embedding = create_dummy_embedding(post["text"])
        
        # Create point
        point = PointStruct(
            id=idx,
            vector=embedding,
            payload=post,
        )
        points.append(point)
        
        platform_emoji = {"linkedin": "💼", "x": "🐦", "instagram": "📸"}
        emoji = platform_emoji.get(post["platform"], "📄")
        print(f"  {emoji} Added {post['platform'].upper()} post (ID: {idx})")
    
    # Upload points in batch
    client.upsert(
        collection_name=collection_name,
        points=points,
    )
    
    print(f"\n✨ Successfully added {len(all_posts)} posts to Qdrant!")
    print(f"\nBreakdown:")
    print(f"  💼 LinkedIn: {len(linkedin_posts)} posts (from linkedin_dataset/)")
    print(f"  🐦 X: {len(SAMPLE_X_POSTS)} posts")
    print(f"  📸 Instagram: {len(SAMPLE_INSTAGRAM_POSTS)} posts")
    
    print(f"\n⚠️  IMPORTANT: These posts use dummy embeddings!")
    print("For production use, implement real embeddings in qdrant_client_helper.py")
    print("See documentation for details on embedding implementation.")
    
    # Test retrieval
    print(f"\n🔍 Testing retrieval...")
    test_query = "AI analytics tool for faster decisions"
    test_embedding = create_dummy_embedding(test_query)
    
    from qdrant_client.models import Filter, FieldCondition, MatchValue
    
    results = client.search(
        collection_name=collection_name,
        query_vector=test_embedding,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="platform",
                    match=MatchValue(value="linkedin")
                )
            ]
        ),
        limit=3,
    )
    
    print(f"\nQuery: '{test_query}'")
    print(f"Found {len(results)} similar LinkedIn posts:")
    for i, result in enumerate(results, 1):
        print(f"\n  {i}. Score: {result.score:.4f}")
        print(f"     Text: {result.payload['text'][:100]}...")
    
    print(f"\n🎉 Qdrant setup complete! You can now use RAG-powered content generation.")
    print(f"\n📝 To add more LinkedIn posts:")
    print(f"  1. Add .txt files to backend/linkedin_dataset/")
    print(f"  2. Run this script again to reload the database")
    print(f"\nNext steps:")
    print(f"  1. Set RAG_ENABLED = True in backend/constants.py")
    print(f"  2. Make sure QDRANT_API_KEY is in your .env file")
    print(f"  3. Run your server and generate content!")
    print(f"\n💡 Tip: Add high-performing LinkedIn posts to improve content quality!")


if __name__ == "__main__":
    asyncio.run(populate_qdrant())

