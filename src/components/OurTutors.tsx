import { Box, Container, Grid, Typography, Card, CardContent, useTheme, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const tutors = [
  {
    name: 'Isuru Hewage',
    subject: 'Mathematics',
    qualifications: [
      'BCS - University of colombo',
      'MSC in Mathematics Teaching - University of Colombo',
      '18+ Years of mathematics teaching experience in edexcel and cambridge',
      '8+ Years as a school teacher in Lyceum International School Nugegoda'
    ],
  },
  {
    name: 'Arosha Senevirathne',
    subject: 'Chemistry',
    qualifications: [
      'BSc (Hons) Special in Chemistry (Top of the Batch, University of Jaffna)',
      'MSc in Chemistry Education (Reading, University of Colombo)',
      'Over 7 years of teaching experience',
      'Leading Chemistry teacher in Nugegoda and Kurunegala areas'
    ],
  },
  {
    name: 'Chatura Wijenaike',
    subject: 'English Literature and Language',
    qualifications: [
      'BA in English (USJP)',
      'MA in Linguistics (University of Kelaniya)',
      'National Diploma in English (Advanced Technical Institute)'
    ],
  },
  {
    name: 'Hashini Perera',
    subject: 'Economics, Business Studies, Commerce',
    qualifications: [
      'CIMA Passed Finalist (Chartered Institute of Management Accountants)',
      'CIM Passed Finalist (Chartered Institute of Marketing)',
      'Former Auditor at KPMG',
      'Over 5+ years of teaching Edexcel/Cambridge curriculum'
    ],
  },
  {
    name: 'Tilak Gunaratne',
    subject: 'Accounting',
    qualifications: [
      'Fellow Member of the Institute of Chartered Accountants (CA)',
      'Associate Member of ICMA',
      'Reading MBA at PIM',
      'Former Director of Finance and Commercial Operations of the Sri Lanka branch of a Singapore-based company',
      'Over 7+ years of teaching Edexcel/Cambridge curriculum'
    ],
  },
  {
    name: 'Chathura Fernando',
    subject: 'Biology',
    qualifications: [
      'B.Sc. (Hons) Biomedical (Top of Batch)',
      'M.Sc. Education',
      'Former Biology Teacher at Lyceum International School, Wattala',
      'Currently Coordinator of Biology at OKI International School, Kandana branch',
      'Visiting Lecturer for Biomedical Science for MSU and IIHS',
      'Over 6+ years of teaching Edexcel/Cambridge curriculum'
    ],
  },
  {
    name: 'Roshan Jayawardana',
    subject: 'Computer Science',
    qualifications: [
      'B.Sc. (Hons) in IT (University of Moratuwa)',
      'M.Sc. (University of Colombo)',
      'Former Full-Time Lecturer at SLIIT',
      'Currently Visiting Lecturer at SLIIT',
      'Professional Member of the Computer Society of Sri Lanka',
      'Over 12+ years of teaching Edexcel/Cambridge curriculum'
    ],
  },
  {
    name: 'Rohab Allang',
    subject: 'Physics',
    qualifications: [
      'B.Sc. (Hons) in Aircraft Maintenance Engineering (General Sir John Kotelawala Defense University)',
      '6 months training in Sri Lankan Airlines (B1.1 Engineering)',
      'Over 3+ years of teaching Edexcel/Cambridge curriculum'
    ],
  },
  {
    name: 'Shehan Cooray',
    subject: 'Physics',
    qualifications: [
      'Bachelor of Engineering (First Class) from the University of Bolton',
      'Full-Time Physics Teacher at a leading international school',
      'Full-Time Physics Lecturer at Pathfinder Academy, Ja-Ela',
      'Associate Member of IIESL and ECSL',
      'Over 8+ years of teaching Edexcel/Cambridge curriculum'
    ],
  },
];

const OurTutors = () => {
  const theme = useTheme();

  return (
    <Box 
      id="our-tutors" 
      sx={{ 
        py: 8,
        width: '100%',
        backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : '#f8f9fa',
        overflowX: 'hidden',
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
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
              mb: 6,
              color: 'primary.main',
            }}
          >
            Our Expert Tutors
          </Typography>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          {tutors.map((tutor, index) => (
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
                  <CardContent>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          bgcolor: 'primary.main',
                          fontSize: '1.5rem',
                        }}
                      >
                        {tutor.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {tutor.name}
                        </Typography>
                        <Chip 
                          label={tutor.subject} 
                          color="primary" 
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      {tutor.qualifications.map((qualification, idx) => (
                        <Typography 
                          key={idx} 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mb: 1,
                            display: 'flex',
                            alignItems: 'flex-start',
                            '&:before': {
                              content: '"•"',
                              marginRight: 1,
                              color: 'primary.main',
                            }
                          }}
                        >
                          {qualification}
                        </Typography>
                      ))}
                    </Box>
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

export default OurTutors; 