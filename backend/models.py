"""
Pydantic models and dataclasses for the AI Marketing Tool API
"""

from typing import List
from dataclasses import dataclass
from pydantic import BaseModel, Field


# ──────────────────────────────────────────────────────────────────────────────
# Agent Output Models
# ──────────────────────────────────────────────────────────────────────────────


class PlatformContent(BaseModel):
    """Generated content structure for a single platform with hook, body, and outro."""
    hook: str = Field(description="Attention-grabbing opening line to capture audience")
    body: str = Field(description="Main content delivering the core message")
    outro: str = Field(description="Closing statement with call-to-action")


class GeneratedContent(BaseModel):
    """Generated social media content for all platforms."""
    linkedin: PlatformContent = Field(description="Professional LinkedIn post content")
    x: PlatformContent = Field(description="Concise X (formerly Twitter) post content")
    instagram: PlatformContent = Field(description="Engaging Instagram caption content")


class EditedContent(BaseModel):
    """Edited social media content."""
    edited_text: str = Field(description="The edited post text")


class EditedPartContent(BaseModel):
    """Edited content for a specific part (hook, body, or outro)."""
    content: str = Field(description="The edited content for the specific part")


class ImagePrompt(BaseModel):
    """Generated image prompt."""
    prompt: str = Field(description="Detailed prompt for image generation")


# ──────────────────────────────────────────────────────────────────────────────
# API Response Models
# ──────────────────────────────────────────────────────────────────────────────


class PlatformContentResponse(BaseModel):
    """Response structure for a single platform's content."""
    hook: str
    body: str
    outro: str


class GenerateResponse(BaseModel):
    """Response from the generate endpoint."""
    linkedin: PlatformContentResponse
    x: PlatformContentResponse
    instagram: PlatformContentResponse
    linkedin_image_url: str
    x_image_url: str
    instagram_image_url: str


class EditResponse(BaseModel):
    """Response from the edit endpoint - same format as GenerateResponse."""
    hook: str
    body: str
    outro: str
    image_url: str | None = None


# ──────────────────────────────────────────────────────────────────────────────
# Agent Dependencies
# ──────────────────────────────────────────────────────────────────────────────


@dataclass
class AgentDeps:
    """Dependencies for the agent."""
    product_images_base64: List[str] = None
    
    def __post_init__(self):
        if self.product_images_base64 is None:
            self.product_images_base64 = []
