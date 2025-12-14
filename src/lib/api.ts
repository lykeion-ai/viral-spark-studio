/**
 * API service for communicating with the backend
 */

const API_BASE_URL = '/api';

// Types matching backend response
export interface PlatformContentResponse {
  hook: string;
  body: string;
  outro: string;
}

export interface GenerateApiResponse {
  linkedin: PlatformContentResponse;
  x: PlatformContentResponse;
  instagram: PlatformContentResponse;
  linkedin_image_url: string;
  x_image_url: string;
  instagram_image_url: string;
}

export interface EditApiResponse {
  hook: string;
  body: string;
  outro: string;
  image_url: string | null;
}

/**
 * Generate content for all platforms
 */
export async function generateContent(
  prompt: string,
  images: File[]
): Promise<GenerateApiResponse> {
  const formData = new FormData();
  formData.append('prompt', prompt);
  
  for (const image of images) {
    formData.append('images', image);
  }

  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Edit content for a specific platform
 */
export async function editContent(
  prompt: string,
  hook: string,
  body: string,
  outro: string,
  imageUrl?: string
): Promise<EditApiResponse> {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('hook', hook);
  formData.append('body', body);
  formData.append('outro', outro);
  
  if (imageUrl) {
    formData.append('image_url', imageUrl);
  }

  const response = await fetch(`${API_BASE_URL}/edit`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

