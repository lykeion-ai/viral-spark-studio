# AI Marketing Tool API

Generate and edit viral social media posts for LinkedIn, Twitter/X, and Instagram using AI.

## Features

- **Generate Endpoint**: Creates platform-optimized content and images for LinkedIn, Twitter/X, and Instagram
- **Edit Endpoint**: Modifies existing posts based on user instructions and regenerates images
- **RAG (Retrieval Augmented Generation)**: Enhances content generation with high-performing examples from Qdrant vector database

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file and add your API keys:

```env
# Required
OPENROUTER_API_KEY=your_openrouter_api_key_here
FAL_KEY=your_fal_api_key_here

# Optional: For RAG functionality
QDRANT_API_KEY=your_qdrant_api_key_here
QDRANT_URL=https://your-qdrant-instance.cloud.qdrant.io:6333
QDRANT_COLLECTION_NAME=social_media_posts
```

**Note**: RAG functionality is optional. If `QDRANT_API_KEY` is not set, the system will use traditional content generation without retrieval.

### 3. Run the Server

```bash
python server.py
```

Or with uvicorn directly:

```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## RAG (Retrieval Augmented Generation) Setup

The system now supports RAG to enhance content generation with examples from a Qdrant vector database.

### Quick Start with RAG

1. **Get Qdrant credentials**: Sign up at [Qdrant Cloud](https://cloud.qdrant.io/) or use a self-hosted instance

2. **Add credentials to `.env`**:
   ```env
   QDRANT_API_KEY=your_api_key
   QDRANT_URL=https://your-instance.cloud.qdrant.io:6333
   ```

3. **Populate the database**:
   ```bash
   python populate_qdrant.py
   ```

4. **Enable RAG** in `constants.py`:
   ```python
   RAG_ENABLED = True
   ```

5. **Generate content** - RAG will automatically enhance generation with similar high-performing posts!

### How RAG Works

1. **Initial Draft**: Generates brief initial text capturing key themes
2. **Retrieval**: Searches Qdrant for 3 similar high-performing posts
3. **Final Generation**: Creates content using retrieved examples as inspiration

### Documentation

See [RAG_SETUP.md](./RAG_SETUP.md) for:
- Detailed setup instructions
- Qdrant schema and configuration
- Custom embedding implementation
- Performance tuning
- Troubleshooting

### Disabling RAG

To use traditional generation without RAG:
- Don't set `QDRANT_API_KEY`, or
- Set `RAG_ENABLED = False` in `constants.py`

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

