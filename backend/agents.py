"""
AI Agents for content generation, editing, and image creation
"""

import asyncio
import logging
from functools import lru_cache
from typing import List

import fal_client
from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.messages import ModelRequest, ModelResponse

from constants import (
    MODEL,
    FAL_IMAGE_MODEL,
    LINKEDIN_CONTENT_SYSTEM_PROMPT,
    X_CONTENT_SYSTEM_PROMPT,
    INSTAGRAM_CONTENT_SYSTEM_PROMPT,
    CONTENT_EDIT_SYSTEM_PROMPT,
    CONTENT_PART_EDIT_SYSTEM_PROMPT,
    IMAGE_PROMPT_SYSTEM_PROMPT,
    RAG_INITIAL_LINKEDIN_PROMPT,
    RAG_INITIAL_X_PROMPT,
    RAG_INITIAL_INSTAGRAM_PROMPT,
    RAG_FINAL_LINKEDIN_PROMPT,
    RAG_FINAL_X_PROMPT,
    RAG_FINAL_INSTAGRAM_PROMPT,
    RAG_ENABLED,
    OUTPUT_VALIDATION_RETRIES,
    REQUEST_LIMIT,
    TOKEN_LIMIT,
)
from models import (
    PlatformContent,
    GeneratedContent,
    EditedContent,
    EditedPartContent,
    ImagePrompt,
    AgentDeps,
)

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────────────────
# Platform-Specific Content Generation Agents
# ──────────────────────────────────────────────────────────────────────────────


def create_linkedin_agent() -> Agent[AgentDeps, PlatformContent]:
    """Create an agent for generating LinkedIn content."""
    logger.info(f"Creating LinkedIn content agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=LINKEDIN_CONTENT_SYSTEM_PROMPT,
        deps_type=AgentDeps,
        result_type=PlatformContent,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


def create_x_agent() -> Agent[AgentDeps, PlatformContent]:
    """Create an agent for generating X (formerly Twitter) content."""
    logger.info(f"Creating X content agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=X_CONTENT_SYSTEM_PROMPT,
        deps_type=AgentDeps,
        result_type=PlatformContent,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


def create_instagram_agent() -> Agent[AgentDeps, PlatformContent]:
    """Create an agent for generating Instagram content."""
    logger.info(f"Creating Instagram content agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=INSTAGRAM_CONTENT_SYSTEM_PROMPT,
        deps_type=AgentDeps,
        result_type=PlatformContent,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


@lru_cache(maxsize=1)
def get_linkedin_agent() -> Agent[AgentDeps, PlatformContent]:
    """Return a singleton agent instance for LinkedIn content generation."""
    logger.debug("Getting LinkedIn agent (cached)")
    return create_linkedin_agent()


@lru_cache(maxsize=1)
def get_x_agent() -> Agent[AgentDeps, PlatformContent]:
    """Return a singleton agent instance for X content generation."""
    logger.debug("Getting X agent (cached)")
    return create_x_agent()


@lru_cache(maxsize=1)
def get_instagram_agent() -> Agent[AgentDeps, PlatformContent]:
    """Return a singleton agent instance for Instagram content generation."""
    logger.debug("Getting Instagram agent (cached)")
    return create_instagram_agent()


# ──────────────────────────────────────────────────────────────────────────────
# RAG-Based Content Generation Agents (Initial Text Generation)
# ──────────────────────────────────────────────────────────────────────────────


class InitialText(BaseModel):
    """Initial text generated for retrieval."""
    text: str = Field(description="Brief initial text capturing key themes")


def create_rag_initial_linkedin_agent() -> Agent[AgentDeps, InitialText]:
    """Create an agent for generating initial LinkedIn text for RAG retrieval."""
    logger.info(f"Creating RAG initial LinkedIn agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=RAG_INITIAL_LINKEDIN_PROMPT,
        deps_type=AgentDeps,
        result_type=InitialText,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


def create_rag_initial_x_agent() -> Agent[AgentDeps, InitialText]:
    """Create an agent for generating initial X text for RAG retrieval."""
    logger.info(f"Creating RAG initial X agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=RAG_INITIAL_X_PROMPT,
        deps_type=AgentDeps,
        result_type=InitialText,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


def create_rag_initial_instagram_agent() -> Agent[AgentDeps, InitialText]:
    """Create an agent for generating initial Instagram text for RAG retrieval."""
    logger.info(f"Creating RAG initial Instagram agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=RAG_INITIAL_INSTAGRAM_PROMPT,
        deps_type=AgentDeps,
        result_type=InitialText,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


@lru_cache(maxsize=1)
def get_rag_initial_linkedin_agent() -> Agent[AgentDeps, InitialText]:
    """Return a singleton agent for initial LinkedIn text generation."""
    logger.debug("Getting RAG initial LinkedIn agent (cached)")
    return create_rag_initial_linkedin_agent()


@lru_cache(maxsize=1)
def get_rag_initial_x_agent() -> Agent[AgentDeps, InitialText]:
    """Return a singleton agent for initial X text generation."""
    logger.debug("Getting RAG initial X agent (cached)")
    return create_rag_initial_x_agent()


@lru_cache(maxsize=1)
def get_rag_initial_instagram_agent() -> Agent[AgentDeps, InitialText]:
    """Return a singleton agent for initial Instagram text generation."""
    logger.debug("Getting RAG initial Instagram agent (cached)")
    return create_rag_initial_instagram_agent()


# ──────────────────────────────────────────────────────────────────────────────
# RAG-Based Content Generation Agents (Final Generation with Retrieved Examples)
# ──────────────────────────────────────────────────────────────────────────────


def create_rag_final_linkedin_agent() -> Agent[AgentDeps, PlatformContent]:
    """Create an agent for generating final LinkedIn content with RAG examples."""
    logger.info(f"Creating RAG final LinkedIn agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=RAG_FINAL_LINKEDIN_PROMPT,
        deps_type=AgentDeps,
        result_type=PlatformContent,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


def create_rag_final_x_agent() -> Agent[AgentDeps, PlatformContent]:
    """Create an agent for generating final X content with RAG examples."""
    logger.info(f"Creating RAG final X agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=RAG_FINAL_X_PROMPT,
        deps_type=AgentDeps,
        result_type=PlatformContent,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


def create_rag_final_instagram_agent() -> Agent[AgentDeps, PlatformContent]:
    """Create an agent for generating final Instagram content with RAG examples."""
    logger.info(f"Creating RAG final Instagram agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=RAG_FINAL_INSTAGRAM_PROMPT,
        deps_type=AgentDeps,
        result_type=PlatformContent,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


@lru_cache(maxsize=1)
def get_rag_final_linkedin_agent() -> Agent[AgentDeps, PlatformContent]:
    """Return a singleton agent for final LinkedIn content generation."""
    logger.debug("Getting RAG final LinkedIn agent (cached)")
    return create_rag_final_linkedin_agent()


@lru_cache(maxsize=1)
def get_rag_final_x_agent() -> Agent[AgentDeps, PlatformContent]:
    """Return a singleton agent for final X content generation."""
    logger.debug("Getting RAG final X agent (cached)")
    return create_rag_final_x_agent()


@lru_cache(maxsize=1)
def get_rag_final_instagram_agent() -> Agent[AgentDeps, PlatformContent]:
    """Return a singleton agent for final Instagram content generation."""
    logger.debug("Getting RAG final Instagram agent (cached)")
    return create_rag_final_instagram_agent()


# ──────────────────────────────────────────────────────────────────────────────
# RAG Helper Functions
# ──────────────────────────────────────────────────────────────────────────────


async def generate_initial_text_for_retrieval(
    prompt: str,
    platform: str,
    deps: AgentDeps,
) -> str:
    """
    Generate initial text that will be used for retrieval from Qdrant.
    
    Args:
        prompt: User's input prompt
        platform: Target platform (linkedin, x, instagram)
        deps: Agent dependencies
    
    Returns:
        Initial text for retrieval
    """
    from pydantic_ai.usage import UsageLimits
    
    limits = UsageLimits(
        request_limit=REQUEST_LIMIT,
        total_tokens_limit=TOKEN_LIMIT
    )
    
    logger.info(f"Generating initial {platform} text for retrieval...")
    
    # Select the appropriate initial agent
    if platform == "linkedin":
        agent = get_rag_initial_linkedin_agent()
    elif platform == "x":
        agent = get_rag_initial_x_agent()
    elif platform == "instagram":
        agent = get_rag_initial_instagram_agent()
    else:
        raise ValueError(f"Unknown platform: {platform}")
    
    try:
        result = await agent.run(prompt, deps=deps, usage_limits=limits)
        initial_text = result.data.text
        logger.info(f"Initial {platform} text generated: {initial_text[:100]}...")
        return initial_text
    except Exception as e:
        logger.error(f"Failed to generate initial {platform} text: {e}", exc_info=True)
        # Fallback to user prompt if initial generation fails
        return prompt


async def retrieve_and_generate_content(
    prompt: str,
    platform: str,
    deps: AgentDeps,
    num_examples: int = 3,
) -> PlatformContent:
    """
    RAG-based content generation: generate initial text, retrieve similar posts, 
    then generate final content with examples.
    
    Args:
        prompt: User's input prompt
        platform: Target platform (linkedin, x, instagram)
        deps: Agent dependencies
        num_examples: Number of similar posts to retrieve
    
    Returns:
        Final generated platform content
    """
    from pydantic_ai.usage import UsageLimits
    from qdrant_client_helper import retrieve_similar_posts
    
    limits = UsageLimits(
        request_limit=REQUEST_LIMIT,
        total_tokens_limit=TOKEN_LIMIT
    )
    
    logger.info(f"Starting RAG-based generation for {platform}...")
    
    # Step 1: Generate initial text for retrieval
    initial_text = await generate_initial_text_for_retrieval(prompt, platform, deps)
    
    # Step 2: Retrieve similar posts from Qdrant
    logger.info(f"Retrieving similar {platform} posts from Qdrant...")
    similar_posts = await retrieve_similar_posts(
        query_text=initial_text,
        platform=platform,
        limit=num_examples
    )
    
    # Step 3: Build enhanced prompt with retrieved examples
    enhanced_prompt = prompt
    if similar_posts:
        logger.info(f"Found {len(similar_posts)} similar posts, adding to prompt")
        examples_text = "\n\n--- SIMILAR HIGH-PERFORMING POSTS FOR INSPIRATION ---\n\n"
        for i, post in enumerate(similar_posts, 1):
            examples_text += f"Example {i}:\n{post}\n\n"
        examples_text += "--- END OF EXAMPLES ---\n\n"
        examples_text += "Now create an original post based on the user's requirements, using these examples for inspiration on style and structure.\n\n"
        enhanced_prompt = examples_text + prompt
    else:
        logger.warning(f"No similar posts found for {platform}, generating without RAG")
    
    # Step 4: Generate final content with RAG examples
    if platform == "linkedin":
        agent = get_rag_final_linkedin_agent()
    elif platform == "x":
        agent = get_rag_final_x_agent()
    elif platform == "instagram":
        agent = get_rag_final_instagram_agent()
    else:
        raise ValueError(f"Unknown platform: {platform}")
    
    try:
        logger.info(f"Generating final {platform} content with RAG examples...")
        result = await agent.run(enhanced_prompt, deps=deps, usage_limits=limits)
        logger.info(f"RAG-based {platform} content generated successfully")
        return result.data
    except Exception as e:
        logger.error(f"Failed to generate final {platform} content: {e}", exc_info=True)
        raise


async def generate_all_platform_content(
    prompt: str,
    deps: AgentDeps,
) -> GeneratedContent:
    """
    Generate content for all platforms using 3 separate API calls in parallel.
    If RAG is enabled, uses retrieval-augmented generation workflow.
    """
    from pydantic_ai.usage import UsageLimits
    
    limits = UsageLimits(
        request_limit=REQUEST_LIMIT,
        total_tokens_limit=TOKEN_LIMIT
    )
    
    logger.info(f"Starting content generation for all platforms (RAG: {'ENABLED' if RAG_ENABLED else 'DISABLED'})...")
    
    if RAG_ENABLED:
        # Use RAG-based generation
        logger.info("Using RAG-based content generation workflow")
        
        # Run all 3 RAG workflows in parallel
        linkedin_task = retrieve_and_generate_content(prompt, "linkedin", deps)
        x_task = retrieve_and_generate_content(prompt, "x", deps)
        instagram_task = retrieve_and_generate_content(prompt, "instagram", deps)
        
        try:
            linkedin_content, x_content, instagram_content = await asyncio.gather(
                linkedin_task,
                x_task,
                instagram_task,
            )
            
            logger.info("All platforms generated successfully with RAG")
            
            return GeneratedContent(
                linkedin=linkedin_content,
                x=x_content,
                instagram=instagram_content,
            )
        except Exception as e:
            logger.error(f"RAG-based content generation failed: {e}", exc_info=True)
            raise
    else:
        # Use traditional generation without RAG
        logger.info("Using traditional content generation (without RAG)")
        
        linkedin_agent = get_linkedin_agent()
        x_agent = get_x_agent()
        instagram_agent = get_instagram_agent()
        
        # Run all 3 API calls in parallel
        linkedin_task = linkedin_agent.run(prompt, deps=deps, usage_limits=limits)
        x_task = x_agent.run(prompt, deps=deps, usage_limits=limits)
        instagram_task = instagram_agent.run(prompt, deps=deps, usage_limits=limits)
        
        try:
            linkedin_result, x_result, instagram_result = await asyncio.gather(
                linkedin_task,
                x_task,
                instagram_task,
            )
            
            logger.info(f"LinkedIn content generated. Usage: {linkedin_result.usage()}")
            logger.info(f"X content generated. Usage: {x_result.usage()}")
            logger.info(f"Instagram content generated. Usage: {instagram_result.usage()}")
            
            return GeneratedContent(
                linkedin=linkedin_result.data,
                x=x_result.data,
                instagram=instagram_result.data,
            )
        except Exception as e:
            logger.error(f"Content generation failed: {e}", exc_info=True)
            raise


# ──────────────────────────────────────────────────────────────────────────────
# Content Edit Agent
# ──────────────────────────────────────────────────────────────────────────────


def create_content_edit_agent() -> Agent[None, EditedContent]:
    """Create an agent for editing social media content."""
    logger.info(f"Creating content edit agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=CONTENT_EDIT_SYSTEM_PROMPT,
        result_type=EditedContent,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


@lru_cache(maxsize=1)
def get_content_edit_agent() -> Agent[None, EditedContent]:
    """Return a singleton agent instance for content editing."""
    logger.debug("Getting content edit agent (cached)")
    return create_content_edit_agent()


async def run_content_edit_agent(
    agent: Agent[None, EditedContent],
    prompt: str,
    message_history: List[ModelRequest | ModelResponse] | None = None,
) -> EditedContent:
    """Execute an edit request against the content edit agent."""
    from pydantic_ai.usage import UsageLimits
    
    limits = UsageLimits(
        request_limit=REQUEST_LIMIT,
        total_tokens_limit=TOKEN_LIMIT
    )
    
    try:
        logger.info("Running content edit agent")
        result = await agent.run(prompt, message_history=message_history, usage_limits=limits)
        logger.info(f"Content edit completed successfully. Usage: {result.usage()}")
        return result.data
    except Exception as e:
        logger.error(f"Content edit failed: {e}", exc_info=True)
        raise


# ──────────────────────────────────────────────────────────────────────────────
# Content Part Edit Agent
# ──────────────────────────────────────────────────────────────────────────────


def create_content_part_edit_agent() -> Agent[None, EditedPartContent]:
    """Create an agent for editing a specific part of social media content."""
    logger.info(f"Creating content part edit agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=CONTENT_PART_EDIT_SYSTEM_PROMPT,
        result_type=EditedPartContent,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


@lru_cache(maxsize=1)
def get_content_part_edit_agent() -> Agent[None, EditedPartContent]:
    """Return a singleton agent instance for content part editing."""
    logger.debug("Getting content part edit agent (cached)")
    return create_content_part_edit_agent()


async def edit_content_part(
    part_name: str,
    current_content: str,
    full_context: str,
    edit_instructions: str,
) -> str:
    """Edit a specific part (hook, body, or outro) of the content."""
    from pydantic_ai.usage import UsageLimits
    
    limits = UsageLimits(
        request_limit=REQUEST_LIMIT,
        total_tokens_limit=TOKEN_LIMIT
    )
    
    agent = get_content_part_edit_agent()
    
    prompt = f"""
Part to edit: {part_name.upper()}

Current {part_name} content:
{current_content}

Full post context:
{full_context}

Edit instructions:
{edit_instructions}

Please generate the new content for the {part_name} only.
"""
    
    try:
        logger.info(f"Editing {part_name} with instructions: {edit_instructions[:50]}...")
        result = await agent.run(prompt, usage_limits=limits)
        logger.info(f"Successfully edited {part_name}. Usage: {result.usage()}")
        return result.data.content
    except Exception as e:
        logger.error(f"Failed to edit {part_name}: {e}", exc_info=True)
        raise


async def edit_full_content(
    hook: str,
    body: str,
    outro: str,
    edit_instructions: str,
) -> tuple[str, str, str]:
    """Edit all parts of the content (hook, body, outro) in parallel."""
    full_context = f"Hook: {hook}\n\nBody: {body}\n\nOutro: {outro}"
    
    logger.info("Editing all content parts in parallel...")
    
    # Run all edits in parallel
    hook_task = edit_content_part("hook", hook, full_context, edit_instructions)
    body_task = edit_content_part("body", body, full_context, edit_instructions)
    outro_task = edit_content_part("outro", outro, full_context, edit_instructions)
    
    try:
        new_hook, new_body, new_outro = await asyncio.gather(
            hook_task,
            body_task,
            outro_task,
        )
        logger.info("Successfully edited all content parts")
        return new_hook, new_body, new_outro
    except Exception as e:
        logger.error(f"Failed to edit content: {e}", exc_info=True)
        raise


# ──────────────────────────────────────────────────────────────────────────────
# Image Prompt Agent
# ──────────────────────────────────────────────────────────────────────────────


def create_image_prompt_agent() -> Agent[None, ImagePrompt]:
    """Create an agent for generating image prompts."""
    logger.info(f"Creating image prompt agent with model: {MODEL}")
    return Agent(
        MODEL,
        system_prompt=IMAGE_PROMPT_SYSTEM_PROMPT,
        result_type=ImagePrompt,
        retries=OUTPUT_VALIDATION_RETRIES,
    )


@lru_cache(maxsize=1)
def get_image_prompt_agent() -> Agent[None, ImagePrompt]:
    """Return a singleton agent instance for image prompt generation."""
    logger.debug("Getting image prompt agent (cached)")
    return create_image_prompt_agent()


async def run_image_prompt_agent(
    agent: Agent[None, ImagePrompt],
    prompt: str,
    message_history: List[ModelRequest | ModelResponse] | None = None,
) -> ImagePrompt:
    """Execute an image prompt request against the image prompt agent."""
    from pydantic_ai.usage import UsageLimits
    
    limits = UsageLimits(
        request_limit=REQUEST_LIMIT,
        total_tokens_limit=TOKEN_LIMIT
    )
    
    try:
        logger.info("Running image prompt agent")
        result = await agent.run(prompt, message_history=message_history, usage_limits=limits)
        logger.info(f"Image prompt generation completed successfully. Usage: {result.usage()}")
        return result.data
    except Exception as e:
        logger.error(f"Image prompt generation failed: {e}", exc_info=True)
        raise


# ──────────────────────────────────────────────────────────────────────────────
# Image Generation Functions
# ──────────────────────────────────────────────────────────────────────────────


class ImageGenerationError(Exception):
    """Exception raised when image generation fails."""
    pass


async def generate_image(prompt: str, image_urls: list[str]) -> str:
    """Generate/edit an image using Fal.ai nano-banana-pro and return the URL."""
    logger.info(f"Starting image generation with {len(image_urls)} reference images")
    logger.debug(f"Image generation prompt: {prompt[:150]}..." if len(prompt) > 150 else f"Image generation prompt: {prompt}")
    
    try:
        handler = await fal_client.submit_async(
            FAL_IMAGE_MODEL,
            arguments={
                "prompt": prompt,
                "image_urls": image_urls,
            },
        )
        logger.debug(f"Submitted async image generation request to {FAL_IMAGE_MODEL}")
        
        # Wait for completion by iterating through events
        async for event in handler.iter_events(with_logs=True):
            if hasattr(event, 'logs'):
                for log in event.logs:
                    logger.debug(f"Fal.ai log: {log}")
        
        # Get the final result
        result = await handler.get()
        image_url = result["images"][0]["url"]
        logger.info(f"Image generation completed successfully: {image_url}")
        return image_url
    except Exception as e:
        logger.error(f"Image generation failed: {e}", exc_info=True)
        raise ImageGenerationError(f"Image generation failed: {str(e)}")


def _format_platform_content(content: PlatformContent) -> str:
    """Format platform content (hook + body + outro) into a single string for image prompt generation."""
    return f"{content.hook}\n\n{content.body}\n\n{content.outro}"


async def generate_platform_images(
    product_description: str,
    linkedin_content: PlatformContent,
    x_content: PlatformContent,
    instagram_content: PlatformContent,
    product_image_urls: list[str],
) -> tuple[str, str, str]:
    """Generate optimized images for each platform."""
    logger.info("Generating platform-specific images for LinkedIn, X, and Instagram")
    image_prompt_agent = get_image_prompt_agent()
    
    # Format content for prompts
    linkedin_text = _format_platform_content(linkedin_content)
    x_text = _format_platform_content(x_content)
    instagram_text = _format_platform_content(instagram_content)
    
    # Generate image prompts for each platform
    logger.info("Creating image prompts for all platforms...")
    linkedin_prompt_task = image_prompt_agent.run(
        f"Create a professional marketing image prompt for LinkedIn. "
        f"Product: {product_description}. Post content: {linkedin_text}. "
        f"Style: Professional, clean, corporate-friendly."
    )
    
    x_prompt_task = image_prompt_agent.run(
        f"Create an eye-catching marketing image prompt for X (formerly Twitter). "
        f"Product: {product_description}. Post content: {x_text}. "
        f"Style: Bold, attention-grabbing, shareable."
    )
    
    instagram_prompt_task = image_prompt_agent.run(
        f"Create a visually stunning marketing image prompt for Instagram. "
        f"Product: {product_description}. Post content: {instagram_text}. "
        f"Style: Aesthetic, lifestyle-focused, Instagram-worthy."
    )
    
    # Run all prompt generations concurrently
    logger.info("Waiting for image prompt generation to complete...")
    linkedin_result, x_result, instagram_result = await asyncio.gather(
        linkedin_prompt_task,
        x_prompt_task,
        instagram_prompt_task,
    )
    logger.info("All image prompts generated successfully")
    logger.debug(f"LinkedIn prompt: {linkedin_result.data.prompt[:100]}...")
    logger.debug(f"X prompt: {x_result.data.prompt[:100]}...")
    logger.debug(f"Instagram prompt: {instagram_result.data.prompt[:100]}...")
    
    # Generate images concurrently using product images as base
    logger.info("Generating images for all platforms concurrently...")
    linkedin_image, x_image, instagram_image = await asyncio.gather(
        generate_image(linkedin_result.data.prompt, product_image_urls),
        generate_image(x_result.data.prompt, product_image_urls),
        generate_image(instagram_result.data.prompt, product_image_urls),
    )
    logger.info("All platform images generated successfully")
    
    return linkedin_image, x_image, instagram_image


async def generate_edited_image(
    original_content: str,
    edit_instructions: str,
    edited_content: str,
    original_image_url: str,
) -> str:
    """Generate a new image based on the edited content."""
    logger.info("Generating image for edited content")
    image_prompt_agent = get_image_prompt_agent()
    
    logger.info("Creating image prompt for edited content...")
    result = await image_prompt_agent.run(
        f"Create an image prompt for edited social media content. "
        f"Original: {original_content}. "
        f"Edit instructions: {edit_instructions}. "
        f"New content: {edited_content}. "
        f"Style: Modern, engaging, scroll-stopping."
    )
    logger.debug(f"Generated image prompt: {result.data.prompt[:100]}...")
    
    logger.info("Generating edited image...")
    new_image_url = await generate_image(result.data.prompt, [original_image_url])
    logger.info("Edited image generated successfully")
    return new_image_url
