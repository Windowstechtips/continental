// Cloudinary service for fetching and managing images

// Types
export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
  tags?: string[];
  alt?: string;
  title?: string;
}

// Configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '';
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || '';

// Test Cloudinary configuration
console.log('Cloudinary Configuration:', {
  cloudName: CLOUDINARY_CLOUD_NAME || 'Not set',
  apiKey: CLOUDINARY_API_KEY ? 'Set (hidden)' : 'Not set',
  apiSecret: CLOUDINARY_API_SECRET ? 'Set (hidden)' : 'Not set',
});

// Function to test Cloudinary connection
export const testCloudinaryConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Cloudinary connection...');
    
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary credentials');
      return false;
    }
    
    // Try to fetch root resources as a simple test
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image/upload?max_results=1`;
    const auth = btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary connection test failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return false;
    }
    
    const data = await response.json();
    console.log('Cloudinary connection test successful:', {
      resourceCount: data.resources?.length || 0
    });
    
    return true;
  } catch (error) {
    console.error('Cloudinary connection test error:', error);
    return false;
  }
};

// Run the test when the module loads
testCloudinaryConnection().then(success => {
  console.log(`Cloudinary connection test ${success ? 'passed' : 'failed'}`);
});

// Function to fetch gallery images from Cloudinary
export const fetchGalleryImages = async (): Promise<CloudinaryImage[]> => {
  try {
    console.log('Fetching gallery images from Cloudinary...');
    
    if (!CLOUDINARY_CLOUD_NAME) {
      console.error('Missing Cloudinary cloud name');
      return [];
    }
    
    // Define the patterns to check
    const patterns = [
      // Try simple numeric filenames first (1.jpg, 2.jpg, etc.)
      ...[...Array(20)].map((_, i) => ({ 
        publicId: `${i + 1}`, 
        format: 'jpg',
        title: `Gallery Image ${i + 1}`
      })),
      
      // Try common image naming patterns
      ...[...Array(10)].map((_, i) => ({ 
        publicId: `image_${i + 1}`, 
        format: 'jpg',
        title: `Image ${i + 1}`
      })),
      
      ...[...Array(10)].map((_, i) => ({ 
        publicId: `gallery_${i + 1}`, 
        format: 'jpg',
        title: `Gallery ${i + 1}`
      })),
      
      ...[...Array(5)].map((_, i) => ({ 
        publicId: `photo_${i + 1}`, 
        format: 'jpg',
        title: `Photo ${i + 1}`
      })),
      
      // Try other common formats for the first few images
      ...[...Array(5)].map((_, i) => ({ 
        publicId: `${i + 1}`, 
        format: 'png',
        title: `Gallery Image ${i + 1}`
      })),
      
      ...[...Array(5)].map((_, i) => ({ 
        publicId: `${i + 1}`, 
        format: 'jpeg',
        title: `Gallery Image ${i + 1}`
      })),
      
      ...[...Array(5)].map((_, i) => ({ 
        publicId: `${i + 1}`, 
        format: 'webp',
        title: `Gallery Image ${i + 1}`
      }))
    ];
    
    console.log(`Checking ${patterns.length} possible image patterns...`);
    
    // Check each pattern in parallel for better performance
    const checkResults = await Promise.all(
      patterns.map(async ({ publicId, format, title }) => {
        try {
          const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/galleryimages/${publicId}.${format}`;
          const response = await fetch(url, { method: 'HEAD' });
          
          if (response.ok) {
            return {
              exists: true,
              publicId,
              format,
              title,
              url
            };
          }
          return { exists: false };
        } catch (error) {
          return { exists: false };
        }
      })
    );
    
    // Filter out patterns that don't exist
    const existingImages = checkResults.filter(result => result.exists);
    console.log(`Found ${existingImages.length} images in the galleryimages folder`);
    
    // Convert to CloudinaryImage format
    const images: CloudinaryImage[] = existingImages.map(img => ({
      public_id: img.publicId!,
      secure_url: img.url!,
      format: img.format!,
      width: 800, // Default width
      height: 600, // Default height
      created_at: new Date().toISOString(),
      alt: img.title!,
      title: img.title!
    }));
    
    return images;
  } catch (error) {
    console.error('Error fetching gallery images from Cloudinary:', error);
    return [];
  }
};

// Function to get optimized Cloudinary URL with transformations
export const getOptimizedUrl = (
  publicId: string, 
  options: { 
    width?: number; 
    height?: number; 
    quality?: number;
    crop?: string;
    format?: string;
  } = {}
): string => {
  const { 
    width = 800, 
    height, 
    quality = 80, 
    crop = 'fill',
    format = 'auto'
  } = options;
  
  let transformations = `f_${format},q_${quality}`;
  
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (crop) transformations += `,c_${crop}`;
  
  // Add the folder prefix for the URL
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};

// Function to get thumbnail URL
export const getThumbnailUrl = (publicId: string): string => {
  return getOptimizedUrl(publicId, { width: 200, height: 150, crop: 'thumb' });
};

// Function to get full-size URL for modal view
export const getFullSizeUrl = (publicId: string): string => {
  return getOptimizedUrl(publicId, { width: 1200, quality: 90 });
}; 