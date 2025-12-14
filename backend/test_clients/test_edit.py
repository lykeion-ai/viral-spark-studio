#!/usr/bin/env python3
"""
Test script for the AI Marketing Tool API - Edit Endpoint
Calls the /edit endpoint using data from a previous /generate run
"""

import argparse
import asyncio
import json
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


async def test_edit(
    server_url: str,
    input_json_path: Path,
    platform: str,
    edit_prompt: str,
    output_dir: Path,
) -> None:
    """Call the /edit endpoint and save the response to disk."""
    
    # Load the previous generate response
    if not input_json_path.exists():
        print(f"Error: Input JSON file not found: {input_json_path}")
        return
    
    with open(input_json_path, "r", encoding="utf-8") as f:
        generate_data = json.load(f)
    
    # Get the platform data
    if platform not in generate_data:
        print(f"Error: Platform '{platform}' not found in JSON. Available: {list(generate_data.keys())}")
        return
    
    platform_data = generate_data[platform]
    image_url = generate_data.get(f"{platform}_image_url")
    
    # Create output directory with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = output_dir / f"edit_{platform}_{timestamp}"
    output_path.mkdir(parents=True, exist_ok=True)
    
    print(f"\n{'='*60}")
    print("AI Marketing Tool - Edit Test")
    print(f"{'='*60}")
    print(f"Server: {server_url}")
    print(f"Platform: {platform}")
    print(f"Edit Prompt: {edit_prompt}")
    print(f"Input JSON: {input_json_path}")
    print(f"Output: {output_path}")
    print(f"{'='*60}\n")
    
    print("Original Content:")
    print("-" * 40)
    print(f"HOOK: {platform_data['hook']}")
    print(f"\nBODY: {platform_data['body']}")
    print(f"\nOUTRO: {platform_data['outro']}")
    print(f"\nIMAGE URL: {image_url}")
    print("-" * 40)
    
    # Prepare the form data
    form_data = {
        "prompt": edit_prompt,
        "hook": platform_data["hook"],
        "body": platform_data["body"],
        "outro": platform_data["outro"],
    }
    
    # Only include image_url if it exists
    if image_url:
        form_data["image_url"] = image_url
    
    async with httpx.AsyncClient(timeout=300.0) as client:
        print("\nSending request to /edit endpoint...")
        print("(This may take a moment while content is being edited)\n")
        
        try:
            response = await client.post(
                f"{server_url}/edit",
                data=form_data,
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
        
        # Save text response
        print("Saving edited content...")
        
        edited_text = f"{result['hook']}\n\n{result['body']}\n\n{result['outro']}"
        text_path = output_path / f"{platform}_edited.txt"
        text_path.write_text(edited_text, encoding="utf-8")
        print(f"  Edited post saved to: {text_path}")
        
        # Save full JSON response
        json_path = output_path / "edit_response.json"
        json_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
        print(f"  Full JSON response saved to: {json_path}")
        
        # Download new image if one was generated
        if result.get("image_url"):
            print("\nDownloading edited image...")
            await download_image(
                client,
                result["image_url"],
                output_path / f"{platform}_edited_image.png"
            )
        else:
            print("\nNo new image generated (use @image tag to generate new image)")
        
        # Print summary
        print(f"\n{'='*60}")
        print("EDIT RESULT SUMMARY")
        print(f"{'='*60}")
        
        print(f"\n✏️  EDITED {platform.upper()} POST:")
        print("-" * 40)
        print(f"HOOK: {result['hook']}")
        print(f"\nBODY: {result['body']}")
        print(f"\nOUTRO: {result['outro']}")
        
        if result.get("image_url"):
            print(f"\nNEW IMAGE URL: {result['image_url']}")
        else:
            print(f"\nIMAGE URL: {image_url} (unchanged)")
        
        print(f"\n{'='*60}")
        print(f"✅ All files saved to: {output_path}")
        print(f"{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Test the AI Marketing Tool /edit endpoint",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Edit hook only
  python test_edit.py --input ./test_output/generate_20251213_131511/full_response.json \\
      --platform linkedin --prompt "@hook Make it more professional and catchy"

  # Edit body and outro
  python test_edit.py --input ./test_output/generate_20251213_131511/full_response.json \\
      --platform instagram --prompt "@body @outro Add more emojis and make it fun"

  # Edit all parts (no tags)
  python test_edit.py --input ./test_output/generate_20251213_131511/full_response.json \\
      --platform x --prompt "Make it shorter and more punchy"

  # Edit with new image generation
  python test_edit.py --input ./test_output/generate_20251213_131511/full_response.json \\
      --platform linkedin --prompt "@hook @image Make the hook more urgent and generate a matching image"

Tag Reference:
  @hook   - Edit only the hook
  @body   - Edit only the body  
  @outro  - Edit only the outro
  @image  - Generate a new image
  (no tags) - Edit all text parts (hook, body, outro)
        """
    )
    
    parser.add_argument(
        "--server",
        type=str,
        default="http://localhost:8000",
        help="Server URL (default: http://localhost:8000)"
    )
    
    parser.add_argument(
        "--input",
        type=str,
        required=True,
        help="Path to full_response.json from a previous /generate run"
    )
    
    parser.add_argument(
        "--platform",
        type=str,
        required=True,
        choices=["linkedin", "x", "instagram"],
        help="Platform to edit (linkedin, x, or instagram)"
    )
    
    parser.add_argument(
        "--prompt",
        type=str,
        required=True,
        help="Edit instructions (use @hook, @body, @outro, @image tags to target specific parts)"
    )
    
    parser.add_argument(
        "--output",
        type=str,
        default="./test_output",
        help="Output directory for saved files (default: ./test_output)"
    )
    
    args = parser.parse_args()
    
    asyncio.run(test_edit(
        server_url=args.server,
        input_json_path=Path(args.input),
        platform=args.platform,
        edit_prompt=args.prompt,
        output_dir=Path(args.output),
    ))


if __name__ == "__main__":
    main()

