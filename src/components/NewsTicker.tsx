import { useState, useEffect, useCallback } from 'react';
import { Box, useTheme, Typography, Button, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { fetchLatestNews } from '../services/supabase';
import type { NewsItem } from '../services/supabase';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const formatDate = (dateString: string, isMobile: boolean) => {
  const date = new Date(dateString);
  if (isMobile) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

const NewsTicker = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isVerySmall = useMediaQuery('(max-width:350px)');
  const [news, setNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await fetchLatestNews();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  const getFormattedTitle = useCallback((title: string) => {
    if (isVerySmall) {
      return truncateText(title, 15); // Very small screens: 15 characters
    }
    if (isMobile) {
      return truncateText(title, 25); // Mobile screens: 25 characters
    }
    return title;
  }, [isMobile, isVerySmall]);

  if (!news) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 56, sm: 64 },
          left: 0,
          right: 0,
          height: 40,
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          zIndex: 1150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Loading news...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 56, sm: 64 },
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        zIndex: 1150,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Static date and title section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 2 },
          px: { xs: 1, sm: 3 },
          borderRight: '1px solid rgba(255,255,255,0.3)',
          minWidth: 'fit-content',
          backgroundColor: theme.palette.primary.dark,
          height: '100%',
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            fontWeight: 500,
            whiteSpace: 'nowrap',
            mr: { xs: 0.5, sm: 1 },
          }}
        >
          {formatDate(news.created_at, isMobile)}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            fontWeight: 600,
            whiteSpace: 'nowrap',
            maxWidth: { xs: '80px', sm: 'none' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {getFormattedTitle(news.title)}
        </Typography>
        <Button
          href="#news"
          endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
          sx={{
            color: 'white',
            ml: { xs: 0.5, sm: 2 },
            textTransform: 'none',
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
            minWidth: 'auto',
            padding: { xs: '2px 4px', sm: '4px 12px' },
            borderRadius: '12px',
            '& .MuiButton-endIcon': {
              ml: { xs: 0.2, sm: 1 },
            },
            height: { xs: '24px', sm: '32px' },
          }}
        >
          {isVerySmall ? '>' : isMobile ? 'More' : 'Read More'}
        </Button>
      </Box>

      {/* Scrolling content section */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'hidden',
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <motion.div
          animate={{
            x: [0, -1000],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            paddingLeft: '24px',
          }}
        >
          <Typography
            component="div"
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {news.content}
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default NewsTicker; 