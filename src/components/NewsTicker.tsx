import { useState, useEffect } from 'react';
import { Box, useTheme, Typography, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
};

const NewsTicker = () => {
  const theme = useTheme();
  const [news, setNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

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
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Loading news...</Typography>
      </Box>
    );
  }

  const newsContent = (
    <Typography
      variant="body1"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        mx: 6,
        fontSize: '0.95rem',
        whiteSpace: 'nowrap',
      }}
    >
      <span>|</span>
      <span>{formatDate(news.created_at)}</span>
      <span>|</span>
      <strong>{news.title}</strong>
      <span>-</span>
      <span>{truncateText(news.content, 12)}</span>
      <Link 
        href="#news" 
        sx={{ 
          color: 'inherit',
          textDecoration: 'none',
          fontWeight: 600,
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        Read More
      </Link>
      <span>|</span>
    </Typography>
  );

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
        zIndex: 1000,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: '-50%' }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 'fit-content',
        }}
      >
        {newsContent}
        {newsContent}
        {newsContent}
        {newsContent}
      </motion.div>
    </Box>
  );
};

export default NewsTicker; 