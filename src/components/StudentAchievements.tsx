import { Box, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const StudentAchievements = () => {
  const theme = useTheme();

  return (
    <Box
      id="achievements"
      sx={{
        py: { xs: 6, sm: 8 },
        backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : '#f8f9fa',
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
            Student Achievements
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              px: { xs: 2, sm: 0 },
            }}
          >
            jehans very cool website indeed, This is a placeholder till we get ideas
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default StudentAchievements; 