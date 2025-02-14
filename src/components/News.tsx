import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Box,
  useTheme,
  Divider,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { fetchNews } from '../services/supabase';
import type { NewsItem } from '../services/supabase';
import Calendar from './Calendar';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const News = () => {
  const theme = useTheme();
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    loadNews();
  }, []);

  return (
    <Box
      id="news"
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          textAlign="center"
          gutterBottom
          sx={{
            mb: 6,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Latest News & Announcements
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                height: '600px',
                overflow: 'hidden',
                overflowY: 'auto',
                pr: 2,
                mr: -2,
                '&::-webkit-scrollbar': {
                  width: '8px',
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
              }}
            >
              <Grid container spacing={3}>
                {news.map((item) => (
                  <Grid item xs={12} key={item.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        },
                        boxShadow: theme.shadows[2],
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="h5"
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            mb: 2,
                          }}
                        >
                          {item.title}
                        </Typography>
                        
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          paragraph
                          sx={{ mb: 3 }}
                        >
                          {item.content}
                        </Typography>

                        <Divider sx={{ my: 2 }} />
                        
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 'auto',
                          }}
                        >
                          <Chip
                            label={formatDate(item.created_at)}
                            size="small"
                            sx={{
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(0, 0, 0, 0.08)',
                              color: theme.palette.text.secondary,
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                {news.length === 0 && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      textAlign="center"
                      color="text.secondary"
                      sx={{ mt: 4 }}
                    >
                      No news articles available at the moment.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 84 }}>
              <Calendar />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default News; 