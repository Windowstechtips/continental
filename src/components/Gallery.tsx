import { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Box, Container, Typography, useTheme, IconButton, Modal, CircularProgress, Alert, List, ListItemButton, ListItemText, Divider, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloseIcon from '@mui/icons-material/Close';
import { CloudinaryImage } from '../services/cloudinary';
import { fetchGalleryImagesFromSupabase, fetchGalleryTags, GalleryImage } from '../services/supabase';

// Fallback images in case Supabase fetch fails
const fallbackImages: CloudinaryImage[] = [
  {
    public_id: 'fallback1',
    secure_url: '/misc/gallery/1.jpg',
    format: 'jpg',
    width: 800,
    height: 600,
    created_at: new Date().toISOString(),
    alt: 'Gallery Image 1',
    title: 'Gallery Image 1'
  },
  {
    public_id: 'fallback2',
    secure_url: '/misc/gallery/2.jpg',
    format: 'jpg',
    width: 800,
    height: 600,
    created_at: new Date().toISOString(),
    alt: 'Gallery Image 2',
    title: 'Gallery Image 2'
  },
  {
    public_id: 'fallback3',
    secure_url: '/misc/gallery/3.jpg',
    format: 'jpg',
    width: 800,
    height: 600,
    created_at: new Date().toISOString(),
    alt: 'Gallery Image 3',
    title: 'Gallery Image 3'
  },
  {
    public_id: 'fallback4',
    secure_url: '/misc/gallery/4.jpg',
    format: 'jpg',
    width: 800,
    height: 600,
    created_at: new Date().toISOString(),
    alt: 'Gallery Image 4',
    title: 'Gallery Image 4'
  },
  {
    public_id: 'fallback5',
    secure_url: '/misc/gallery/5.jpg',
    format: 'jpg',
    width: 800,
    height: 600,
    created_at: new Date().toISOString(),
    alt: 'Gallery Image 5',
    title: 'Gallery Image 5'
  },
  {
    public_id: 'fallback6',
    secure_url: '/misc/gallery/6.jpg',
    format: 'jpg',
    width: 800,
    height: 600,
    created_at: new Date().toISOString(),
    alt: 'Gallery Image 6',
    title: 'Gallery Image 6'
  },
  {
    public_id: 'fallback7',
    secure_url: '/misc/gallery/7.jpg',
    format: 'jpg',
    width: 800,
    height: 600,
    created_at: new Date().toISOString(),
    alt: 'Gallery Image 7',
    title: 'Gallery Image 7'
  }
];

const Gallery = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [failedLoads, setFailedLoads] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [loadingTags, setLoadingTags] = useState(true);
  
  // Fetch tags when component mounts
  useEffect(() => {
    const loadTags = async () => {
      setLoadingTags(true);
      try {
        const fetchedTags = await fetchGalleryTags();
        setTags(['all', ...fetchedTags]);
      } catch (err) {
        console.error('Failed to load gallery tags:', err);
      } finally {
        setLoadingTags(false);
      }
    };
    
    loadTags();
  }, []);
  
  // Load images when selected tag changes
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      setError(null);
      setUsingFallback(false);
      setFailedLoads(0);
      
      try {
        console.log(`Gallery component: Loading images from Supabase with tag: ${selectedTag}...`);
        const galleryImages = await fetchGalleryImagesFromSupabase(selectedTag);
        
        if (galleryImages && galleryImages.length > 0) {
          console.log(`Gallery component: Successfully loaded ${galleryImages.length} images from Supabase`);
          setImages(galleryImages);
          setCurrentIndex(0);
        } else {
          // If no images were returned, set an error and use fallback
          console.warn(`Gallery component: No images found in Supabase with tag: ${selectedTag}, using fallback images`);
          setError(`No images found in the gallery${selectedTag !== 'all' ? ` with category "${selectedTag}"` : ''}. Showing fallback images instead.`);
          setUsingFallback(true);
          setImages(fallbackImages as unknown as GalleryImage[]);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error('Gallery component: Failed to load gallery images:', err);
        setError('Failed to load gallery images. Showing fallback images instead.');
        setUsingFallback(true);
        setImages(fallbackImages as unknown as GalleryImage[]);
        setCurrentIndex(0);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [selectedTag]);

  // Make sure we have a valid currentIndex
  useEffect(() => {
    if (images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images, currentIndex]);

  const handleNext = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
  };
  
  // Handle image load errors
  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>, index: number) => {
    console.error(`Image failed to load: ${images[index]?.secure_url}`);
    setFailedLoads(prev => {
      const newCount = prev + 1;
      // If too many images fail to load, switch to fallback
      if (newCount > 3 && !usingFallback) {
        console.warn('Too many image load failures, switching to fallback images');
        setError('Unable to load images. Using fallback images.');
        setUsingFallback(true);
        setImages(fallbackImages as unknown as GalleryImage[]);
        setCurrentIndex(0);
      }
      return newCount;
    });
    
    // Fallback to a default image if the image fails to load
    (e.target as HTMLImageElement).src = fallbackImages[0].secure_url;
  };

  return (
    <Box
      id="gallery"
      sx={{
        py: { xs: 8, sm: 10 },
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.97)'
          : 'rgba(248, 250, 255, 0.8)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #0056b3, #64b5f6)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #64b5f6, #0056b3)',
        }
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: { xs: 3, sm: 4 },
                fontSize: { xs: '2.25rem', sm: '2.75rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                px: { xs: 2, sm: 0 },
              }}
            >
              Gallery
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
                mb: 4,
                color: 'text.secondary',
                px: { xs: 2, sm: 0 },
              }}
            >
              Explore our collection of images showcasing campus life, events, and student achievements
            </Typography>
          </motion.div>
        </motion.div>

        {/* Modern Category Selector - Visible on both mobile and desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: { xs: 5, sm: 6 },
              width: '100%'
            }}
          >
            {loadingTags ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={32} thickness={4} sx={{ color: 'primary.main' }} />
              </Box>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center',
                  gap: { xs: 1.2, sm: 1.8 },
                  width: '100%',
                  maxWidth: '1100px',
                  mx: 'auto',
                  px: { xs: 1, sm: 0 },
                  py: 1,
                  borderRadius: '16px',
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(30, 30, 35, 0.6)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.05)',
                }}
              >
                {tags.map((tag) => (
                  <motion.div
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box
                      onClick={() => handleTagSelect(tag)}
                      sx={{
                        px: { xs: 2.5, sm: 3.5 },
                        py: { xs: 1.2, sm: 1.6 },
                        borderRadius: '30px',
                        backgroundColor: selectedTag === tag 
                          ? (tag === 'all' 
                              ? 'linear-gradient(135deg, #0056b3 0%, #003b7a 100%)' 
                              : 'linear-gradient(135deg, #0056b3 0%, #0077cc 100%)')
                          : theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.06)' 
                            : 'rgba(0, 0, 0, 0.04)',
                        background: selectedTag === tag 
                          ? (tag === 'all' 
                              ? 'linear-gradient(135deg, #0056b3 0%, #003b7a 100%)' 
                              : 'linear-gradient(135deg, #0056b3 0%, #0077cc 100%)')
                          : 'none',
                        color: selectedTag === tag 
                          ? 'white' 
                          : theme.palette.text.primary,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        fontWeight: selectedTag === tag ? 600 : 500,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        letterSpacing: '0.3px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: selectedTag === tag 
                          ? '0 6px 12px rgba(0, 0, 0, 0.2)' 
                          : 'none',
                        border: `1px solid ${selectedTag === tag 
                          ? 'transparent'
                          : theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'rgba(0, 0, 0, 0.08)'}`,
                        '&:hover': {
                          backgroundColor: selectedTag === tag 
                            ? 'transparent'
                            : theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.06)',
                          boxShadow: selectedTag === tag 
                            ? '0 8px 16px rgba(0, 0, 0, 0.3)'
                            : '0 4px 8px rgba(0, 0, 0, 0.06)',
                        }
                      }}
                    >
                      {tag === 'all' ? 'All Images' : tag}
                    </Box>
                  </motion.div>
                ))}
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Gallery Content */}
        <Box sx={{ width: '100%', mb: 4 }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              flexDirection: 'column',
              py: 10 
            }}>
              <CircularProgress 
                size={48} 
                thickness={4} 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#bb86fc' : '#6200ea',
                  mb: 2
                }} 
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  fontWeight: 500
                }}
              >
                Loading gallery images...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ 
              textAlign: 'center', 
              color: 'text.secondary', 
              mb: 2,
              p: 3,
              borderRadius: '12px',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,0,0,0.1)' : 'rgba(255,0,0,0.05)',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255,0,0,0.2)' : 'rgba(255,0,0,0.1)',
            }}>
              <Typography variant="body1" color="error" sx={{ mb: 0, fontWeight: 500 }}>
                {error}
              </Typography>
            </Box>
          ) : null}

          {!loading && images.length > 0 && (
            <>
              {usingFallback && (
                <Box sx={{ 
                  textAlign: 'center', 
                  mb: 3,
                  p: 2,
                  borderRadius: '12px',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,152,0,0.1)' : 'rgba(255,152,0,0.05)',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,152,0,0.2)' : 'rgba(255,152,0,0.1)',
                }}>
                  <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
                    Using fallback images. Gallery images could not be loaded.
                  </Typography>
                </Box>
              )}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <Box sx={{ 
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  mb: 3,
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 20px 40px -12px rgba(0,0,0,0.5)' 
                    : '0 20px 40px -12px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255,255,255,0.1)' 
                    : 'none',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 25px 50px -12px rgba(0,0,0,0.6)' 
                      : '0 25px 50px -12px rgba(0,0,0,0.2)',
                  }
                }}>
                  {/* Main Image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                      }}
                      onClick={handleImageClick}
                    >
                      <Box
                        component="img"
                        src={images[currentIndex]?.secure_url || fallbackImages[0].secure_url}
                        alt={images[currentIndex]?.alt || 'Gallery Image'}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          '&:hover': {
                            transform: 'scale(1.03)',
                          }
                        }}
                        onError={(e) => handleImageError(e, currentIndex)}
                      />
                      
                      {/* Image Title and Tags Overlay */}
                      {images[currentIndex] && (
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)',
                            p: { xs: 2.5, sm: 3.5 },
                            color: 'white',
                            backdropFilter: 'blur(5px)',
                          }}
                        >
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              mb: 1.5, 
                              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                              fontWeight: 600,
                              letterSpacing: '0.3px'
                            }}
                          >
                            {images[currentIndex].title || 'Gallery Image'}
                          </Typography>
                          
                          {images[currentIndex].tags && images[currentIndex].tags.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                              {images[currentIndex].tags.map(tag => (
                                <motion.div
                                  key={tag}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Box
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTagSelect(tag);
                                    }}
                                    sx={{
                                      px: { xs: 2.5, sm: 3 },
                                      py: { xs: 1, sm: 1.2 },
                                      borderRadius: '30px',
                                      background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
                                      backdropFilter: 'blur(8px)',
                                      color: 'white',
                                      fontSize: { xs: '0.95rem', sm: '1.05rem' },
                                      cursor: 'pointer',
                                      textTransform: 'capitalize',
                                      fontWeight: 500,
                                      border: '1px solid rgba(255,255,255,0.3)',
                                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                      transition: 'all 0.3s ease',
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.25) 100%)',
                                        boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                                      }
                                    }}
                                  >
                                    {tag}
                                  </Box>
                                </motion.div>
                              ))}
                            </Box>
                          )}
                        </Box>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    sx={{
                      position: 'absolute',
                      left: { xs: 8, sm: 16 },
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      backdropFilter: 'blur(5px)',
                      color: 'white',
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        transform: 'translateY(-50%) scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    <NavigateBeforeIcon fontSize="medium" />
                  </IconButton>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    sx={{
                      position: 'absolute',
                      right: { xs: 8, sm: 16 },
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      backdropFilter: 'blur(5px)',
                      color: 'white',
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        transform: 'translateY(-50%) scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    <NavigateNextIcon fontSize="medium" />
                  </IconButton>
                </Box>
              </motion.div>

              {/* Thumbnails */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    gap: { xs: 1.5, sm: 2 },
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    pb: 2,
                    pt: 1,
                    px: 1,
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    borderRadius: '12px',
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(30, 30, 35, 0.4)' 
                      : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
                      : '0 8px 24px rgba(0, 0, 0, 0.05)',
                    '&::-webkit-scrollbar': {
                      height: { xs: 0, sm: 8 },
                      width: 0,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: 4,
                      display: { xs: 'none', sm: 'block' },
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
                      borderRadius: 4,
                      display: { xs: 'none', sm: 'block' },
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)',
                      },
                    },
                  }}
                >
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Box
                        component="img"
                        src={image.secure_url}
                        alt={image.alt || `Thumbnail ${index + 1}`}
                        onClick={() => handleThumbnailClick(index)}
                        sx={{
                          width: { xs: 90, sm: 110 },
                          height: { xs: 68, sm: 82 },
                          borderRadius: '8px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: index === currentIndex 
                            ? `3px solid ${theme.palette.primary.main}` 
                            : '3px solid transparent',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          opacity: index === currentIndex ? 1 : 0.7,
                          boxShadow: index === currentIndex 
                            ? '0 6px 12px rgba(0, 0, 0, 0.2)' 
                            : '0 2px 8px rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            opacity: 1,
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                          },
                        }}
                        onError={(e) => handleImageError(e, index)}
                      />
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </>
          )}
        </Box>

        {/* Modal for enlarged image */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(5px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ 
              position: 'relative', 
              maxWidth: '90vw', 
              maxHeight: '90vh',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)',
            }}>
              {images[currentIndex] && (
                <Box
                  component="img"
                  src={images[currentIndex].secure_url}
                  alt={images[currentIndex].alt || 'Gallery Image'}
                  sx={{
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    objectFit: 'contain',
                    borderRadius: '12px',
                  }}
                  onError={(e) => handleImageError(e, currentIndex)}
                />
              )}
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(5px)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </motion.div>
        </Modal>
        
        {/* Warning message when using fallback */}
        {usingFallback && error && (
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 2, 
              mb: 2, 
              maxWidth: '1000px', 
              mx: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
          >
            {error}
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default Gallery; 