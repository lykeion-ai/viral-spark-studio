# LinkedIn Dataset Usage Guide

## Overview

The `populate_qdrant.py` script has been updated to automatically load LinkedIn posts from the `linkedin_dataset/` directory instead of using hardcoded sample posts.

## How It Works

### 1. **Directory Structure**

```
backend/
├── linkedin_dataset/
│   ├── file1.txt
│   ├── file2.txt
│   ├── file3.txt
│   └── ... (up to file20.txt)
├── populate_qdrant.py
└── ...
```

### 2. **File Format**

Each `.txt` file contains **one complete LinkedIn post**. Example:

```
Most of your audience isn't ready to buy.

And that's the biggest marketing mistake brands make.

They focus only on the people ready to convert right now.

The real game? 

Building brand before the purchase moment happens.

...

So when they're ready… they come straight to you.
```

### 3. **Automatic Parsing**

The script automatically parses each post into three parts:

- **Hook**: The attention-grabbing opening (first paragraph or lines)
- **Body**: The main content (middle paragraphs)
- **Outro**: The closing with call-to-action (last paragraph)

## Usage

### Running the Script

```bash
cd backend
python populate_qdrant.py
```

The script will:
1. ✅ Load all `.txt` files from `linkedin_dataset/`
2. ✅ Parse each post into hook, body, outro
3. ✅ Generate embeddings (currently dummy embeddings)
4. ✅ Upload to Qdrant vector database
5. ✅ Include sample X and Instagram posts

### Expected Output

```
📁 Loading 20 LinkedIn posts from linkedin_dataset/
  ✅ Loaded: file1.txt
  ✅ Loaded: file2.txt
  ...
  ✅ Loaded: file20.txt

✅ Successfully loaded 20 LinkedIn posts

🔗 Connecting to Qdrant at https://...
📦 Creating collection 'social_media_posts'...
✅ Collection 'social_media_posts' created successfully

📝 Adding 25 sample posts...
  💼 Added LINKEDIN post (ID: 0)
  💼 Added LINKEDIN post (ID: 1)
  ...
  🐦 Added X post (ID: 20)
  📸 Added INSTAGRAM post (ID: 23)

✨ Successfully added 25 posts to Qdrant!

Breakdown:
  💼 LinkedIn: 20 posts (from linkedin_dataset/)
  🐦 X: 3 posts
  📸 Instagram: 2 posts
```

## Adding More LinkedIn Posts

### Step 1: Add New Files

Simply add new `.txt` files to the `linkedin_dataset/` directory:

```bash
# Create a new file
echo "Your amazing LinkedIn post content here..." > backend/linkedin_dataset/file21.txt
```

### Step 2: Reload the Database

Run the populate script again:

```bash
cd backend
python populate_qdrant.py
```

When prompted, choose to delete and recreate the collection to include the new posts.

## Post Structure Examples

### Example 1: Multi-Paragraph Post

```
This is the hook - grabs attention! 🚀

This is the body paragraph 1.

This is the body paragraph 2 with more details.

And here's the outro - what do you think? 👇
```

**Parsed as:**
- **Hook**: "This is the hook - grabs attention! 🚀"
- **Body**: "This is the body paragraph 1.\n\nThis is the body paragraph 2 with more details."
- **Outro**: "And here's the outro - what do you think? 👇"

### Example 2: Single Paragraph Post

```
Hook line here
Body content in the middle
More body content
Last line is the outro
```

**Parsed as:**
- **Hook**: "Hook line here"
- **Body**: "Body content in the middle\nMore body content"
- **Outro**: "Last line is the outro"

## Best Practices

### ✅ Do:
- Use high-performing LinkedIn posts
- Include variety in topics and styles
- Add posts with proven engagement
- Keep one post per file
- Use descriptive filenames (e.g., `product_launch_1.txt`)

### ❌ Don't:
- Add empty files
- Mix multiple posts in one file
- Include metadata or comments (just the post text)
- Use special characters in filenames (stick to letters, numbers, underscores)

## Qdrant Collection Schema

Each LinkedIn post is stored with the following structure:

```python
{
    "text": "Full post content",
    "platform": "linkedin",
    "hook": "Opening line",
    "body": "Main content",
    "outro": "Call to action",
    "engagement": 0.0,  # No engagement data from files
    "source_file": "file1.txt"
}
```

## RAG Integration

Once populated, the RAG system will:

1. **Generate Initial Text**: Create a brief draft based on user prompt
2. **Retrieve Similar Posts**: Search Qdrant for similar LinkedIn posts
3. **Enhance Prompt**: Add retrieved examples to the generation prompt
4. **Generate Final Content**: Create high-quality content inspired by examples

Example retrieval:

```python
# User prompt: "Launch our new AI productivity tool"
# Initial text: "AI tool for team productivity and collaboration"
# Retrieved: 3 similar posts from linkedin_dataset/
# Final: High-quality LinkedIn post using proven patterns
```

## Maintenance

### Updating Posts

To update the database with new or modified posts:

1. Add/edit `.txt` files in `linkedin_dataset/`
2. Run `python populate_qdrant.py`
3. Choose "yes" to recreate the collection

### Checking Current Posts

View what's in your Qdrant collection:

```python
from qdrant_client_helper import get_qdrant_client

client = get_qdrant_client()
info = client.get_collection("social_media_posts")
print(f"Total posts: {info.points_count}")
```

### Backing Up Your Dataset

```bash
# Create a backup
tar -czf linkedin_dataset_backup.tar.gz linkedin_dataset/

# Restore from backup
tar -xzf linkedin_dataset_backup.tar.gz
```

## Current Dataset

Your current dataset contains **20 LinkedIn posts** covering topics like:
- Marketing strategies
- Product launches
- Business insights
- Audience engagement
- Content creation tips

## Troubleshooting

### Issue: "No .txt files found"
**Solution**: Verify files are in `backend/linkedin_dataset/` with `.txt` extension

### Issue: "Skipping empty file"
**Solution**: Remove or populate empty `.txt` files

### Issue: Posts not being retrieved
**Solution**: 
1. Verify collection exists in Qdrant
2. Check RAG_ENABLED = True in constants.py
3. Review logs for retrieval operations

### Issue: Poor parsing (hook/body/outro incorrect)
**Solution**: The parser uses a heuristic approach. For best results:
- Use double line breaks between paragraphs
- Keep hook as first paragraph
- Keep CTA/question as last paragraph

## Advanced: Custom Parsing

If the automatic parsing doesn't work for your posts, you can create a custom version:

```python
def parse_post_custom(text: str) -> dict:
    """Custom parser for your specific post format"""
    # Your custom logic here
    lines = text.split('\n')
    hook = lines[0]
    body = '\n'.join(lines[1:-1])
    outro = lines[-1]
    
    return {
        "hook": hook,
        "body": body,
        "outro": outro
    }
```

Then modify `load_linkedin_posts_from_dataset()` to use your custom parser.

## Next Steps

1. ✅ **Add More Posts**: Populate `linkedin_dataset/` with your best LinkedIn content
2. ✅ **Implement Real Embeddings**: Replace dummy embeddings with OpenAI/Cohere
3. ✅ **Test RAG**: Run `python test_rag.py` to verify retrieval
4. ✅ **Generate Content**: Use the API to create posts with RAG enhancement

## Summary

The updated `populate_qdrant.py` script now:
- ✅ Automatically loads LinkedIn posts from `linkedin_dataset/`
- ✅ Intelligently parses posts into hook, body, outro
- ✅ Supports any number of posts (just add more .txt files)
- ✅ Maintains X and Instagram sample posts
- ✅ Provides clear feedback during loading
- ✅ Tracks source file for each post

This makes it easy to continuously improve your RAG system by adding more high-quality LinkedIn posts!

