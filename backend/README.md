# AI Marketing Tool API

Generate and edit viral social media posts for LinkedIn, Twitter/X, and Instagram using AI.

## Features

- **Generate Endpoint**: Creates platform-optimized content and images for LinkedIn, Twitter/X, and Instagram
- **Edit Endpoint**: Modifies existing posts based on user instructions and regenerates images

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Edit the `.env` file and add your API keys:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
FAL_KEY=your_fal_api_key_here
```

### 3. Run the Server

```bash
python server.py
```

Or with uvicorn directly:

```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### `POST /generate`

Generate viral social media content for all platforms.

**Request (multipart/form-data):**
- `prompt` (string, required): Description of the product/company/campaign
- `images` (files, optional): Product images for reference

**Response:**
```json
{
  "linkedin_post": "Professional LinkedIn post content...",
  "twitter_post": "Concise Twitter post...",
  "instagram_caption": "Engaging Instagram caption with #hashtags...",
  "linkedin_image_url": "https://...",
  "twitter_image_url": "https://...",
  "instagram_image_url": "https://..."
}
```

### `POST /edit`

Edit existing social media content.

**Request (multipart/form-data):**
- `prompt` (string, required): Instructions for how to edit the content
- `content` (string, required): The original text content to edit
- `image` (file, optional): The original post image

**Response:**
```json
{
  "edited_text": "The edited post content...",
  "edited_image_url": "https://..."
}
```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Example Usage

### Generate Content

```bash
curl -X POST http://localhost:8000/generate \
  -F "prompt=Our new eco-friendly water bottle made from recycled materials. Perfect for outdoor enthusiasts and sustainability-conscious consumers." \
  -F "images=@product.jpg"
```

### Edit Content

```bash
curl -X POST http://localhost:8000/edit \
  -F "prompt=Make it more casual and add more emojis" \
  -F "content=Introducing our revolutionary eco-friendly water bottle..."
```

