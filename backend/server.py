"""
AI Marketing Tool API Server
Generates and edits viral social media posts for LinkedIn, X, and Instagram
"""

import tempfile
import os
import logging
import re
from typing import List, Optional

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fal_client

from models import AgentDeps, GenerateResponse, EditResponse, PlatformContentResponse
from agents import (
    generate_all_platform_content,
    edit_content_part,
    edit_full_content,
    generate_platform_images,
    generate_edited_image,
    ImageGenerationError,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Reduce noise from httpx and other libraries
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("fal_client").setLevel(logging.INFO)


# ──────────────────────────────────────────────────────────────────────────────
# Helper Functions
# ──────────────────────────────────────────────────────────────────────────────


def parse_edit_tags(prompt: str) -> set[str]:
    """
    Parse the prompt to find edit tags (@hook, @body, @outro, @image).
    Returns a set of found tags (without the @ symbol).
    """
    valid_tags = {"hook", "body", "outro", "image"}
    pattern = r"@(hook|body|outro|image)"
    found = re.findall(pattern, prompt, re.IGNORECASE)
    return {tag.lower() for tag in found if tag.lower() in valid_tags}


async def upload_image_to_fal(upload_file: UploadFile) -> str:
    """Upload an image to Fal CDN and return the URL."""
    logger.info(f"Uploading image to Fal CDN: {upload_file.filename}")
    content = await upload_file.read()
    logger.debug(f"Read {len(content)} bytes from {upload_file.filename}")
    
    # Create a temporary file to upload
    with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{upload_file.filename}") as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        # Upload to Fal CDN
        url = fal_client.upload_file(tmp_path)
        logger.info(f"Successfully uploaded {upload_file.filename} to Fal CDN: {url}")
        return url
    except Exception as e:
        logger.error(f"Failed to upload {upload_file.filename} to Fal CDN: {e}")
        raise
    finally:
        # Clean up temp file
        os.unlink(tmp_path)
        logger.debug(f"Cleaned up temporary file: {tmp_path}")


# ──────────────────────────────────────────────────────────────────────────────
# FastAPI Application
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="AI Marketing Tool API",
    description="Generate and edit viral social media posts for LinkedIn, X, and Instagram",
    version="1.0.0",
)

# Configure CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    logger.info("Health check endpoint called")
    return {"status": "healthy", "service": "AI Marketing Tool API"}


@app.post("/generate", response_model=GenerateResponse)
async def generate_content(
    prompt: str = Form(..., description="User's prompt describing the product/company"),
    images: List[UploadFile] = File(..., description="Product images (at least one required)"),
):
    """
    Generate viral social media content for LinkedIn, X, and Instagram.
    
    - **prompt**: Description of the product, company, or marketing campaign
    - **images**: Product images to use for generating marketing visuals (required)
    
    Returns generated posts (with hook, body, outro) and images for each platform.
    """
    logger.info(f"=== Starting content generation request ===")
    logger.info(f"Prompt: {prompt[:100]}..." if len(prompt) > 100 else f"Prompt: {prompt}")
    logger.info(f"Number of images provided: {len(images)}")
    
    if not images:
        logger.error("No images provided in request")
        raise HTTPException(status_code=400, detail="At least one product image is required")
    
    try:
        # Upload images to Fal CDN
        logger.info(f"Uploading {len(images)} product images to Fal CDN...")
        product_image_urls = []
        for idx, image in enumerate(images, 1):
            logger.info(f"Uploading image {idx}/{len(images)}: {image.filename}")
            url = await upload_image_to_fal(image)
            product_image_urls.append(url)
        logger.info(f"All product images uploaded successfully")
        
        # Create dependencies
        deps = AgentDeps(product_images_base64=[])  # URLs are used instead now
        
        # Build the full prompt with image context
        full_prompt = prompt
        full_prompt += f"\n\n[User has provided {len(product_image_urls)} product image(s) for reference]"
        
        # Generate content using 3 separate API calls in parallel
        logger.info("Generating social media content for all platforms (3 parallel API calls)...")
        generated_content = await generate_all_platform_content(full_prompt, deps)
        logger.info("Content generation completed successfully")
        logger.debug(f"LinkedIn hook: {generated_content.linkedin.hook[:50]}...")
        logger.debug(f"X hook: {generated_content.x.hook[:50]}...")
        logger.debug(f"Instagram hook: {generated_content.instagram.hook[:50]}...")
        
        # Generate platform-specific images using product images
        logger.info("Generating platform-specific marketing images...")
        linkedin_image, x_image, instagram_image = await generate_platform_images(
            product_description=prompt,
            linkedin_content=generated_content.linkedin,
            x_content=generated_content.x,
            instagram_content=generated_content.instagram,
            product_image_urls=product_image_urls,
        )
        logger.info("All platform images generated successfully")
        
        logger.info("=== Content generation request completed successfully ===")
        return GenerateResponse(
            linkedin=PlatformContentResponse(
                hook=generated_content.linkedin.hook,
                body=generated_content.linkedin.body,
                outro=generated_content.linkedin.outro,
            ),
            x=PlatformContentResponse(
                hook=generated_content.x.hook,
                body=generated_content.x.body,
                outro=generated_content.x.outro,
            ),
            instagram=PlatformContentResponse(
                hook=generated_content.instagram.hook,
                body=generated_content.instagram.body,
                outro=generated_content.instagram.outro,
            ),
            linkedin_image_url=linkedin_image,
            x_image_url=x_image,
            instagram_image_url=instagram_image,
        )
        
    except ImageGenerationError as e:
        logger.error(f"Image generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Content generation failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Content generation failed: {str(e)}")


@app.post("/edit", response_model=EditResponse)
async def edit_content(
    prompt: str = Form(..., description="Edit instructions with optional tags (@hook, @body, @outro, @image)"),
    hook: str = Form(..., description="The current hook content"),
    body: str = Form(..., description="The current body content"),
    outro: str = Form(..., description="The current outro content"),
    image_url: Optional[str] = Form(None, description="The current image URL (required if @image tag is used)"),
):
    """
    Edit existing social media content based on user instructions with tag-based targeting.
    
    - **prompt**: Edit instructions. Use tags to target specific parts:
        - @hook: Edit only the hook
        - @body: Edit only the body
        - @outro: Edit only the outro
        - @image: Generate a new image
        - No tags: Edit all text parts (hook, body, outro)
    - **hook**: The current hook content
    - **body**: The current body content
    - **outro**: The current outro content
    - **image_url**: The current image URL (required if @image tag is used)
    
    Returns the edited content (hook, body, outro) and optionally a new image URL.
    """
    logger.info(f"=== Starting content edit request ===")
    logger.info(f"Edit instructions: {prompt[:100]}..." if len(prompt) > 100 else f"Edit instructions: {prompt}")
    logger.info(f"Original hook: {hook[:50]}..." if len(hook) > 50 else f"Original hook: {hook}")
    logger.info(f"Original body: {body[:50]}..." if len(body) > 50 else f"Original body: {body}")
    logger.info(f"Original outro: {outro[:50]}..." if len(outro) > 50 else f"Original outro: {outro}")
    logger.info(f"Image URL provided: {image_url is not None}")
    
    try:
        # Parse tags from the prompt
        tags = parse_edit_tags(prompt)
        logger.info(f"Parsed tags from prompt: {tags if tags else 'none (will edit all text parts)'}")
        
        # Initialize with current values
        new_hook = hook
        new_body = body
        new_outro = outro
        new_image_url = image_url
        
        # Create full context for editing
        full_context = f"Hook: {hook}\n\nBody: {body}\n\nOutro: {outro}"
        
        # Determine which parts to edit
        text_tags = tags - {"image"}  # Remove image tag for text editing logic
        
        if not text_tags:
            # No specific text tags found - edit all text parts
            logger.info("No specific tags found, editing all text parts...")
            new_hook, new_body, new_outro = await edit_full_content(
                hook=hook,
                body=body,
                outro=outro,
                edit_instructions=prompt,
            )
        else:
            # Edit only the specified parts in parallel
            import asyncio
            
            tasks = []
            task_mapping = []  # To track which task corresponds to which part
            
            if "hook" in text_tags:
                logger.info("Editing hook...")
                tasks.append(edit_content_part("hook", hook, full_context, prompt))
                task_mapping.append("hook")
            
            if "body" in text_tags:
                logger.info("Editing body...")
                tasks.append(edit_content_part("body", body, full_context, prompt))
                task_mapping.append("body")
            
            if "outro" in text_tags:
                logger.info("Editing outro...")
                tasks.append(edit_content_part("outro", outro, full_context, prompt))
                task_mapping.append("outro")
            
            if tasks:
                results = await asyncio.gather(*tasks)
                for i, part_name in enumerate(task_mapping):
                    if part_name == "hook":
                        new_hook = results[i]
                    elif part_name == "body":
                        new_body = results[i]
                    elif part_name == "outro":
                        new_outro = results[i]
        
        # Generate new image only if @image tag is present
        if "image" in tags:
            if not image_url:
                raise HTTPException(
                    status_code=400,
                    detail="image_url is required when using @image tag"
                )
            
            logger.info("Generating new image (due to @image tag)...")
            full_content = f"{new_hook}\n\n{new_body}\n\n{new_outro}"
            new_image_url = await generate_edited_image(
                original_content=f"{hook}\n\n{body}\n\n{outro}",
                edit_instructions=prompt,
                edited_content=full_content,
                original_image_url=image_url,
            )
            logger.info("New image generated successfully")
        
        logger.info("=== Content edit request completed successfully ===")
        return EditResponse(
            hook=new_hook,
            body=new_body,
            outro=new_outro,
            image_url=new_image_url,
        )
        
    except ImageGenerationError as e:
        logger.error(f"Image generation error during edit: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Content editing failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Content editing failed: {str(e)}")


# ──────────────────────────────────────────────────────────────────────────────
# Run Server
# ──────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting AI Marketing Tool API server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
