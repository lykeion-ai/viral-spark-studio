"""
Qdrant vector database client and helper functions for RAG
"""

import os
import logging
from typing import List
from functools import lru_cache

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, ScoredPoint
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)


def get_chunks(content: str, n_lines_per_chunk: int = 3) -> List[str]:
    """
    Split the content into chunks of n_lines_per_chunk lines each.
    """
    lines = [line.strip() for line in content.split("\n") if line.strip()]
    chunks = [
        "\n".join(lines[i:i+n_lines_per_chunk])
        for i in range(0, len(lines), n_lines_per_chunk)
    ]
    return chunks


@lru_cache(maxsize=1)
def get_qdrant_client() -> QdrantClient:
    """Return a singleton Qdrant client instance for reuse across calls."""
    qdrant_api_key = os.getenv("QDRANT_API_KEY")
    qdrant_url = os.getenv("QDRANT_URL", "https://a8f15c78-eed9-4352-b360-cc39bddf7d45.eu-central-1-0.aws.cloud.qdrant.io:6333")
    
    if not qdrant_api_key:
        logger.warning("QDRANT_API_KEY is not set. RAG functionality will be disabled.")
        return None
    
    logger.info(f"Initializing Qdrant client with URL: {qdrant_url}")
    return QdrantClient(
        url=qdrant_url, 
        api_key=qdrant_api_key,
    )


async def retrieve_similar_posts(
    query_text: str,
    platform: str,
    limit: int = 3,
    collection_name: str = "social_media_posts"
) -> List[str]:
    """
    Retrieve similar posts from Qdrant based on the query text.
    
    Args:
        query_text: The text to use for similarity search
        platform: The platform to filter by (linkedin, x, instagram)
        limit: Maximum number of similar posts to retrieve
        collection_name: Name of the Qdrant collection
    
    Returns:
        List of similar post texts
    """
    try:
        client = get_qdrant_client()
        if client is None:
            logger.warning("Qdrant client not available, skipping retrieval")
            return []
        
        logger.info(f"Retrieving {limit} similar {platform} posts from Qdrant")
        
        # Search for similar posts using the client's neural search
        # Note: This assumes you have embeddings configured in Qdrant
        # You'll need to adapt this based on your actual Qdrant schema
        
        # For now, return empty list if collection doesn't exist
        # In production, you'd use client.search() with proper embeddings
        try:
            # Check if collection exists
            collections = client.get_collections()
            collection_names = [col.name for col in collections.collections]
            
            if collection_name not in collection_names:
                logger.warning(f"Collection '{collection_name}' does not exist in Qdrant")
                return []
            
            # In a real implementation, you would:
            # 1. Generate embeddings for query_text
            # 2. Use client.search() to find similar posts
            # 3. Filter by platform metadata
            # 
            # Example (pseudo-code):
            # results = client.search(
            #     collection_name=collection_name,
            #     query_vector=generate_embedding(query_text),
            #     query_filter={
            #         "must": [
            #             {"key": "platform", "match": {"value": platform}}
            #         ]
            #     },
            #     limit=limit
            # )
            # return [result.payload["text"] for result in results]
            
            logger.info(f"Collection '{collection_name}' exists. Implement search logic.")
            return []
            
        except Exception as e:
            logger.error(f"Error retrieving from Qdrant: {e}")
            return []
    
    except Exception as e:
        logger.error(f"Failed to retrieve similar posts: {e}", exc_info=True)
        return []


async def search_similar_posts_with_embedding(
    embedding: List[float],
    platform: str,
    limit: int = 3,
    collection_name: str = "social_media_posts"
) -> List[dict]:
    """
    Search for similar posts using a pre-computed embedding vector.
    
    Args:
        embedding: The query embedding vector
        platform: The platform to filter by (linkedin, x, instagram)
        limit: Maximum number of similar posts to retrieve
        collection_name: Name of the Qdrant collection
    
    Returns:
        List of similar posts with their metadata
    """
    try:
        client = get_qdrant_client()
        if client is None:
            logger.warning("Qdrant client not available, skipping search")
            return []
        
        logger.info(f"Searching for {limit} similar {platform} posts using embedding")
        
        # Check if collection exists
        collections = client.get_collections()
        collection_names = [col.name for col in collections.collections]
        
        if collection_name not in collection_names:
            logger.warning(f"Collection '{collection_name}' does not exist")
            return []
        
        # Perform vector search with platform filter
        from qdrant_client.models import Filter, FieldCondition, MatchValue
        
        results = client.search(
            collection_name=collection_name,
            query_vector=embedding,
            query_filter=Filter(
                must=[
                    FieldCondition(
                        key="platform",
                        match=MatchValue(value=platform)
                    )
                ]
            ),
            limit=limit
        )
        
        # Extract post texts and metadata
        similar_posts = []
        for result in results:
            post_data = {
                "text": result.payload.get("text", ""),
                "score": result.score,
                "metadata": result.payload
            }
            similar_posts.append(post_data)
        
        logger.info(f"Retrieved {len(similar_posts)} similar posts")
        return similar_posts
    
    except Exception as e:
        logger.error(f"Error searching with embedding: {e}", exc_info=True)
        return []

