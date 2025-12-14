#!/usr/bin/env python3
"""
Test script for the AI Marketing Tool API
Calls the /generate endpoint and saves responses to disk
"""

import argparse
import asyncio
import os
from datetime import datetime
from pathlib import Path

import httpx


async def download_image(client: httpx.AsyncClient, url: str, filepath: Path) -> None:
    """Download an image from a URL and save it to disk."""
    print(f"  Downloading: {url[:80]}...")
    response = await client.get(url, follow_redirects=True)
    response.raise_for_status()
    filepath.write_bytes(response.content)
    print(f"  Saved to: {filepath}")


def format_platform_content(platform_data: dict) -> str:
    """Format platform content (hook, body, outro) into a single string."""
    return f"{platform_data['hook']}\n\n{platform_data['body']}\n\n{platform_data['outro']}"


async def test_generate(
    server_url: str,
    prompt: str,
    image_paths: list[str],
    output_dir: Path,
) -> None:
    """Call the /generate endpoint and save all responses to disk."""
    
    # Create output directory with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = output_dir / f"generate_{timestamp}"
    output_path.mkdir(parents=True, exist_ok=True)
    
    print(f"\n{'='*60}")
    print("AI Marketing Tool - Generate Test")
    print(f"{'='*60}")
    print(f"Server: {server_url}")
    print(f"Prompt: {prompt}")
    print(f"Images: {image_paths}")
    print(f"Output: {output_path}")
    print(f"{'='*60}\n")
    
    # Prepare the multipart form data
    files = []
    for img_path in image_paths:
        path = Path(img_path)
        if not path.exists():
            print(f"Error: Image file not found: {img_path}")
            return
        files.append(("images", (path.name, path.read_bytes(), "image/jpeg")))
    
    data = {"prompt": prompt}
    
    async with httpx.AsyncClient(timeout=300.0) as client:
        print("Sending request to /generate endpoint...")
        print("(This may take a minute while images are generated)\n")
        
        try:
            response = await client.post(
                f"{server_url}/generate",
                data=data,
                files=files,
            )
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            print(f"HTTP Error: {e.response.status_code}")
            print(f"Response: {e.response.text}")
            return
        except httpx.RequestError as e:
            print(f"Request Error: {e}")
            return
        
        result = response.json()
        
        # Save text responses
        print("Saving text content...")
        
        # LinkedIn
        linkedin_text = format_platform_content(result["linkedin"])
        linkedin_text_path = output_path / "linkedin_post.txt"
        linkedin_text_path.write_text(linkedin_text, encoding="utf-8")
        print(f"  LinkedIn post saved to: {linkedin_text_path}")
        
        # X (formerly Twitter)
        x_text = format_platform_content(result["x"])
        x_text_path = output_path / "x_post.txt"
        x_text_path.write_text(x_text, encoding="utf-8")
        print(f"  X post saved to: {x_text_path}")
        
        # Instagram
        instagram_text = format_platform_content(result["instagram"])
        instagram_text_path = output_path / "instagram_caption.txt"
        instagram_text_path.write_text(instagram_text, encoding="utf-8")
        print(f"  Instagram caption saved to: {instagram_text_path}")
        
        # Save all data as JSON
        import json
        json_path = output_path / "full_response.json"
        json_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
        print(f"  Full JSON response saved to: {json_path}")
        
        # Download and save images
        print("\nDownloading images...")
        
        await download_image(
            client, 
            result["linkedin_image_url"], 
            output_path / "linkedin_image.png"
        )
        await download_image(
            client, 
            result["x_image_url"], 
            output_path / "x_image.png"
        )
        await download_image(
            client, 
            result["instagram_image_url"], 
            output_path / "instagram_image.png"
        )
        
        # Print summary
        print(f"\n{'='*60}")
        print("GENERATED CONTENT SUMMARY")
        print(f"{'='*60}")
        
        print("\n📋 LINKEDIN POST:")
        print("-" * 40)
        print(f"HOOK: {result['linkedin']['hook']}")
        print(f"\nBODY: {result['linkedin']['body']}")
        print(f"\nOUTRO: {result['linkedin']['outro']}")
        
        print("\n🐦 X POST:")
        print("-" * 40)
        print(f"HOOK: {result['x']['hook']}")
        print(f"\nBODY: {result['x']['body']}")
        print(f"\nOUTRO: {result['x']['outro']}")
        
        print("\n📸 INSTAGRAM CAPTION:")
        print("-" * 40)
        print(f"HOOK: {result['instagram']['hook']}")
        print(f"\nBODY: {result['instagram']['body']}")
        print(f"\nOUTRO: {result['instagram']['outro']}")
        
        print(f"\n{'='*60}")
        print(f"✅ All files saved to: {output_path}")
        print(f"{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Test the AI Marketing Tool /generate endpoint",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic usage with one image
  python test_generate.py --prompt "Launch our new eco-friendly water bottle" --images product.jpg

  # Multiple images
  python test_generate.py --prompt "Promote our coffee brand" --images coffee1.jpg coffee2.jpg

  # Custom server and output directory
  python test_generate.py --server http://localhost:8000 --output ./results --prompt "..." --images img.jpg
        """
    )
    
    parser.add_argument(
        "--server",
        type=str,
        default="http://localhost:8000",
        help="Server URL (default: http://localhost:8000)"
    )
    
    parser.add_argument(
        "--prompt",
        type=str,
        required=True,
        help="Product/company description for content generation"
    )
    
    parser.add_argument(
        "--images",
        type=str,
        nargs="+",
        required=True,
        help="Path(s) to product image(s)"
    )
    
    parser.add_argument(
        "--output",
        type=str,
        default="./test_output",
        help="Output directory for saved files (default: ./test_output)"
    )
    
    args = parser.parse_args()
    
    asyncio.run(test_generate(
        server_url=args.server,
        prompt=args.prompt,
        image_paths=args.images,
        output_dir=Path(args.output),
    ))


if __name__ == "__main__":
    main()

