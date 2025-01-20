import { Box, Typography, Container, useTheme, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
  {
    image: '/misc/main_slide/1.jpg',
    title: 'Unlock Your Potential, Embrace Education',
  },
  {
    image: '/misc/main_slide/2.jpg',
    title: 'Unlock Your Potential, Embrace Education',
  },
  {
    image: '/misc/main_slide/3.jpg',
    title: 'Unlock Your Potential, Embrace Education',
  },
];

const SLIDE_DURATION = 4000; // 4 seconds total per slide

const Hero = () => {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isZooming, setIsZooming] = useState(true);

  const nextSlide = useCallback(() => {
    setIsZooming(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsZooming(true);
    }, 50);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <Box 
      id="home" 
      sx={{ 
        pt: { xs: 8, sm: 10, md: 12 },
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: currentSlide === index ? 1 : 0,
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: isZooming && currentSlide === index ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 4s ease-out',
            }}
          />
        </Box>
      ))}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '16px', sm: '20px' },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: { xs: 0.75, sm: 1 },
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: 10, sm: 12 },
              height: { xs: 10, sm: 12 },
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
              transition: 'background-color 0.3s ease',
              cursor: 'pointer',
              mx: { xs: 0.5, sm: 0 },
            }}
            onClick={() => {
              setIsZooming(false);
              setTimeout(() => {
                setCurrentSlide(index);
                setIsZooming(true);
              }, 50);
            }}
          />
        ))}
      </Box>
      <Container 
        maxWidth="xl" 
        sx={{ 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            sx={{
              color: 'white',
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: '2rem', sm: '1.75rem', md: '2.5rem' },
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              px: { xs: 2, sm: 0 },
            }}
          >
            {slides[currentSlide].title}
          </Typography>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.primary.main,
                textAlign: 'center',
                fontSize: { xs: '3rem', sm: '3rem', md: '4rem' },
                mt: { xs: 2, sm: 3 },
                mb: { xs: 3, sm: 0 },
                fontWeight: 600,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '-0.02em',
                px: { xs: 2, sm: 0 },
              }}
            >
              Continental College
            </Typography>
            <Box sx={{ 
              display: { xs: 'flex', sm: 'none' },
              justifyContent: 'center',
              width: '100%',
            }}>
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                href="https://chat.whatsapp.com/CeMhwDKaxjJ6J4McgOfesp"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  backgroundColor: '#25D366',
                  '&:hover': {
                    backgroundColor: '#128C7E',
                  },
                  fontSize: '1.2rem',
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Contact Us Now
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Hero; 