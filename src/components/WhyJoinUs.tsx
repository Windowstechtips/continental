import { Box, Container, Grid, Typography, Card, CardContent, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EventNoteIcon from '@mui/icons-material/EventNote';

const reasons = [
  {
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    title: 'Regular Classes',
    description: 'Comprehensive coverage of the entire syllabus, ensuring thorough preparation for school exams and lessons.',
  },
  {
    icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
    title: 'Mock Examinations',
    description: 'Authentic O/L examination environment to assess and prepare students for their actual examinations.',
  },
  {
    icon: <AcUnitIcon sx={{ fontSize: 40 }} />,
    title: 'Fully Air-Conditioned',
    description: 'All classrooms are equipped with modern air-conditioning systems for optimal learning comfort.',
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    title: 'Real College Environment',
    description: 'State-of-the-art facilities with security, canteens, and cutting-edge teaching methods for the next generation.',
  },
  {
    icon: <EventNoteIcon sx={{ fontSize: 40 }} />,
    title: 'Seminars & Workshops',
    description: 'In-depth coverage of complex topics through interactive seminars, ensuring complete understanding.',
  },
];

const WhyJoinUs = () => {
  const theme = useTheme();

  return (
    <Box 
      id="why-join" 
      sx={{ 
        py: { xs: 6, sm: 8 },
        width: '100%',
        backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : '#f8f9fa',
        overflowX: 'hidden',
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          px: { xs: 2, sm: 3, md: 4 },
          mx: 'auto',
        }}
      >
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
              px: { xs: 2, sm: 0 },
            }}
          >
            Why Choose Continental College?
          </Typography>
        </motion.div>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {reasons.map((reason, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(0, 0, 0, 0.4)' 
                      : 'background.paper',
                    borderColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'divider',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease-in-out',
                      boxShadow: theme.palette.mode === 'dark' 
                        ? '0 8px 16px rgba(0,0,0,0.4)' 
                        : theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box
                      sx={{
                        backgroundColor: 'primary.main',
                        borderRadius: '50%',
                        p: { xs: 1.5, sm: 2 },
                        color: 'white',
                        mb: { xs: 1.5, sm: 2 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 'fit-content',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {reason.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ 
                        mb: { xs: 1, sm: 2 }, 
                        fontWeight: 600,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      }}
                    >
                      {reason.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        lineHeight: 1.6,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {reason.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyJoinUs; 