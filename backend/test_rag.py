"""
Test script for RAG functionality
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_qdrant_connection():
    """Test connection to Qdrant."""
    print("=" * 60)
    print("TEST 1: Qdrant Connection")
    print("=" * 60)
    
    from qdrant_client_helper import get_qdrant_client
    
    try:
        client = get_qdrant_client()
        if client is None:
            print("❌ QDRANT_API_KEY not set - RAG will be disabled")
            return False
        
        # Test connection by getting collections
        collections = client.get_collections()
        print(f"✅ Connected to Qdrant successfully")
        print(f"📦 Found {len(collections.collections)} collections:")
        for col in collections.collections:
            print(f"   - {col.name}")
        return True
    except Exception as e:
        print(f"❌ Error connecting to Qdrant: {e}")
        return False


async def test_retrieval():
    """Test retrieval of similar posts."""
    print("\n" + "=" * 60)
    print("TEST 2: Post Retrieval")
    print("=" * 60)
    
    from qdrant_client_helper import retrieve_similar_posts
    
    test_queries = [
        ("AI analytics tool for faster data insights", "linkedin"),
        ("Just launched our new product", "x"),
        ("Behind the scenes of building a startup", "instagram"),
    ]
    
    for query, platform in test_queries:
        print(f"\n🔍 Query: '{query}'")
        print(f"📱 Platform: {platform}")
        
        try:
            similar_posts = await retrieve_similar_posts(
                query_text=query,
                platform=platform,
                limit=2
            )
            
            if similar_posts:
                print(f"✅ Found {len(similar_posts)} similar posts:")
                for i, post in enumerate(similar_posts, 1):
                    print(f"\n   Post {i}:")
                    print(f"   {post[:100]}...")
            else:
                print(f"⚠️  No similar posts found (collection may be empty)")
        except Exception as e:
            print(f"❌ Error during retrieval: {e}")


async def test_initial_text_generation():
    """Test initial text generation for RAG."""
    print("\n" + "=" * 60)
    print("TEST 3: Initial Text Generation")
    print("=" * 60)
    
    from agents import generate_initial_text_for_retrieval
    from models import AgentDeps
    
    test_prompt = "Launching an AI-powered productivity tool that helps teams collaborate better and ship faster"
    platforms = ["linkedin", "x", "instagram"]
    
    deps = AgentDeps(product_images_base64=[])
    
    for platform in platforms:
        print(f"\n📝 Generating initial {platform.upper()} text...")
        print(f"Prompt: {test_prompt}")
        
        try:
            initial_text = await generate_initial_text_for_retrieval(
                prompt=test_prompt,
                platform=platform,
                deps=deps
            )
            print(f"✅ Generated initial text:")
            print(f"   {initial_text}")
        except Exception as e:
            print(f"❌ Error generating initial text: {e}")


async def test_rag_content_generation():
    """Test full RAG-based content generation."""
    print("\n" + "=" * 60)
    print("TEST 4: Full RAG Content Generation")
    print("=" * 60)
    
    from agents import retrieve_and_generate_content
    from models import AgentDeps
    from constants import RAG_ENABLED
    
    print(f"RAG Status: {'✅ ENABLED' if RAG_ENABLED else '❌ DISABLED'}")
    
    if not RAG_ENABLED:
        print("⚠️  Skipping test - RAG is disabled in constants.py")
        return
    
    test_prompt = "Launching an AI-powered productivity tool that helps teams collaborate better"
    platform = "linkedin"
    
    deps = AgentDeps(product_images_base64=[])
    
    print(f"\n🚀 Generating {platform.upper()} content with RAG...")
    print(f"Prompt: {test_prompt}")
    
    try:
        content = await retrieve_and_generate_content(
            prompt=test_prompt,
            platform=platform,
            deps=deps,
            num_examples=2
        )
        
        print(f"\n✅ Generated content successfully!")
        print(f"\n📋 Hook:\n{content.hook}")
        print(f"\n📄 Body:\n{content.body}")
        print(f"\n🎯 Outro:\n{content.outro}")
    except Exception as e:
        print(f"❌ Error generating content: {e}")
        import traceback
        traceback.print_exc()


async def test_environment_variables():
    """Test that all required environment variables are set."""
    print("=" * 60)
    print("TEST 0: Environment Variables")
    print("=" * 60)
    
    required_vars = ["OPENROUTER_API_KEY", "FAL_KEY"]
    optional_vars = ["QDRANT_API_KEY", "QDRANT_URL", "QDRANT_COLLECTION_NAME"]
    
    print("\n✅ Required Variables:")
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"   ✓ {var}: {value[:10]}..." if len(value) > 10 else f"   ✓ {var}: set")
        else:
            print(f"   ✗ {var}: NOT SET ❌")
    
    print("\n📦 Optional Variables (for RAG):")
    for var in optional_vars:
        value = os.getenv(var)
        if value:
            print(f"   ✓ {var}: {value[:30]}..." if len(value) > 30 else f"   ✓ {var}: {value}")
        else:
            print(f"   - {var}: not set (RAG will be disabled)")


async def main():
    """Run all tests."""
    print("\n" + "🧪" * 30)
    print("RAG FUNCTIONALITY TEST SUITE")
    print("🧪" * 30 + "\n")
    
    # Test environment
    await test_environment_variables()
    
    # Test Qdrant connection
    qdrant_ok = await test_qdrant_connection()
    
    if qdrant_ok:
        # Test retrieval
        await test_retrieval()
    else:
        print("\n⚠️  Skipping retrieval tests - Qdrant not connected")
    
    # Test initial text generation
    await test_initial_text_generation()
    
    # Test full RAG generation
    await test_rag_content_generation()
    
    print("\n" + "=" * 60)
    print("TEST SUITE COMPLETE")
    print("=" * 60)
    print("\n📝 Summary:")
    print("   - If Qdrant is connected, RAG is ready to use")
    print("   - If Qdrant is not connected, system falls back to traditional generation")
    print("   - See RAG_SETUP.md for detailed setup instructions")
    print("\n")


if __name__ == "__main__":
    asyncio.run(main())

