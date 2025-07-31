import { Box, Container, Grid, Typography, useTheme, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SecurityIcon from '@mui/icons-material/Security';

const whyJoinReasons = [
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
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Real College Environment',
    description: 'State-of-the-art facilities with security, canteens, and cutting-edge teaching methods for the next generation.',
  },
  {
    icon: <EventNoteIcon sx={{ fontSize: 40 }} />,
    title: 'Seminars & Workshops',
    description: 'In-depth coverage of complex topics through interactive seminars, ensuring complete understanding.',
  },
];

const AboutContinental = () => {
  const theme = useTheme();

  return (
    <Box 
      id="about-continental" 
      sx={{ 
        py: { xs: 4, sm: 6 },
        width: '100%',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.97)' : '#f8f9fa',
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
        {/* About Section */}
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
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '2rem', sm: '2.75rem' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              px: { xs: 1, sm: 0 },
            }}
          >
            About Continental College
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              lineHeight: { xs: 1.6, sm: 1.7 },
              color: 'text.primary',
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto',
              px: { xs: 1, sm: 0 },
            }}
          >
            Continental College, located in Wattala, is a leading educational institution dedicated to academic excellence and holistic 
            student development. We offer both Cambridge and Edexcel O-Level and A-Level programs, supported by a highly qualified 
            panel of teachers. Our college features modern A/C classrooms, a well maintained cafeteria, and 24/7 security to ensure a 
            safe and comfortable learning environment.
          </Typography>
        </motion.div>

        {/* Vision and Mission Cards */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 4, sm: 6 } }}>
          {/* Our Vision */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #0056b3 0%, #003b7a 100%)',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                    : '0 8px 32px rgba(0, 86, 179, 0.2)',
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      fontWeight: 700,
                      mb: { xs: 2, sm: 3 },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 40,
                        backgroundColor: '#64b5f6',
                        borderRadius: 1,
                      }}
                    />
                    Our Vision
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      lineHeight: { xs: 1.5, sm: 1.6 },
                      opacity: 0.95,
                    }}
                  >
                    To be a premier center of international education in 
                    Sri Lanka, empowering students to achieve global 
                    academic standards and become confident, 
                    responsible individuals.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Our Mission */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                    : '0 8px 32px rgba(100, 181, 246, 0.2)',
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      fontWeight: 700,
                      mb: { xs: 2, sm: 3 },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 40,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 1,
                      }}
                    />
                    Our Mission
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      lineHeight: { xs: 1.5, sm: 1.6 },
                      opacity: 0.95,
                    }}
                  >
                    Our mission is to deliver quality education through 
                    internationally recognized curriculum, guided by 
                    experienced educators, and supported by excellent 
                    facilities, fostering academic success, critical 
                    thinking, and lifelong learning.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Why Join Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              fontWeight: 700,
              color: 'primary.main',
              px: { xs: 1, sm: 0 },
            }}
          >
            Why Choose Continental College?
          </Typography>
        </motion.div>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {whyJoinReasons.map((reason, index) => (
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
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease-in-out',
                      boxShadow: theme.palette.mode === 'dark' 
                        ? '0 8px 16px rgba(0,0,0,0.4)' 
                        : theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                    <Box
                      sx={{
                        backgroundColor: 'primary.main',
                        borderRadius: '50%',
                        p: { xs: 1.5, sm: 2 },
                        color: 'white',
                        mb: { xs: 2, sm: 2.5 },
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
                      variant="h6"
                      sx={{ 
                        mb: { xs: 1.5, sm: 2 }, 
                        fontWeight: 600,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      }}
                    >
                      {reason.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        lineHeight: 1.6,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
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

export default AboutContinental;