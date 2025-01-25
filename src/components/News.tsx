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

const News = () => {
  const theme = useTheme();
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  return (
    <Box
      id="news"
      sx={{
        py: { xs: 6, md: 10 },
        minHeight: '100vh',
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
          Latest News
        </Typography>

        <Grid container spacing={4}>
          {news.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                  boxShadow: theme.shadows[4],
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
        </Grid>

        {news.length === 0 && (
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 4 }}
          >
            No news articles available at the moment.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default News; 