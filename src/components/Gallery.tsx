import { Box, Container, Typography, useTheme, IconButton, Modal } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloseIcon from '@mui/icons-material/Close';

const images = [
  { img: '/misc/gallery/1.jpg', title: 'Gallery Image 1' },
  { img: '/misc/gallery/2.jpg', title: 'Gallery Image 2' },
  { img: '/misc/gallery/3.jpg', title: 'Gallery Image 3' },
  { img: '/misc/gallery/4.jpg', title: 'Gallery Image 4' },
  { img: '/misc/gallery/5.jpg', title: 'Gallery Image 5' },
  { img: '/misc/gallery/6.jpg', title: 'Gallery Image 6' },
  { img: '/misc/gallery/7.jpg', title: 'Gallery Image 7' },
];

const Gallery = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
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

  return (
    <Box
      id="gallery"
      sx={{
        py: { xs: 6, sm: 8 },
        backgroundColor: theme.palette.mode === 'dark' ? 'background.default' : '#fff',
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: { xs: 4, sm: 6 },
              color: 'primary.main',
              fontSize: { xs: '2rem', sm: '2.5rem' },
            }}
          >
            Gallery
          </Typography>
        </motion.div>

        <Box sx={{ 
          position: 'relative',
          width: { xs: '100%', sm: '90%' },
          maxWidth: '1000px',
          aspectRatio: '16/9',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2,
          boxShadow: theme.shadows[4],
          mx: 'auto',
          cursor: 'pointer',
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
                src={images[currentIndex].img}
                alt={images[currentIndex].title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
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
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>

        {/* Thumbnails */}
        <Box
          sx={{
            width: { xs: '100%', sm: '90%' },
            maxWidth: '1000px',
            mx: 'auto',
            display: 'flex',
            gap: { xs: 1.5, sm: 2 },
            overflowX: 'auto',
            overflowY: 'hidden',
            pb: 2,
            px: { xs: 0.5, sm: 1 },
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              height: { xs: 0, sm: 8 },
              width: 0,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              borderRadius: 1,
              display: { xs: 'none', sm: 'block' },
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              borderRadius: 1,
              display: { xs: 'none', sm: 'block' },
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              },
            },
          }}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Box
                component="img"
                src={image.img}
                alt={image.title}
                onClick={() => handleThumbnailClick(index)}
                sx={{
                  width: { xs: 100, sm: 120 },
                  height: { xs: 75, sm: 80 },
                  borderRadius: 1,
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: index === currentIndex ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                  transition: 'all 0.3s ease-in-out',
                  opacity: index === currentIndex ? 1 : 0.7,
                  '&:hover': {
                    opacity: 1,
                    transform: 'scale(1.05)',
                  },
                }}
              />
            </motion.div>
          ))}
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
          }}
        >
          <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <Box
              component="img"
              src={images[currentIndex].img}
              alt={images[currentIndex].title}
              sx={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default Gallery; 