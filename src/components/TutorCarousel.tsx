import { Box, Container, Grid, Typography, Card, CardContent, useTheme, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';

const tutors = [
  {
    name: 'Isuru Hewage',
    image: '/misc/teachers/isuru.jpg',
    subject: 'Mathematics',
    curriculum: ['edexcel', 'cambridge'],
    grades: ['9', '10'],
    qualifications: [
      'BCS - University of colombo',
      'MSC in Mathematics Teaching - University of Colombo',
      '18+ Years of mathematics teaching experience in edexcel and cambridge',
      '8+ Years as a school teacher in Lyceum International School Nugegoda'
    ],
  },
  {
    name: 'Arosha Senevirathne',
    image: '/misc/teachers/arosha.jpg',
    subject: 'Chemistry',
    curriculum: ['edexcel', 'cambridge'],
    grades: ['9', '10'],
    qualifications: [
      'BSc (Hons) Special in Chemistry (Top of the Batch, University of Jaffna)',
      'MSc in Chemistry Education (Reading, University of Colombo)',
      'Over 7 years of teaching experience',
      'Leading Chemistry teacher in Nugegoda and Kurunegala areas'
    ],
  },
  {
    name: 'Chatura Wijenaike',
    image: '/misc/teachers/chatura.jpg',
    subject: 'English Literature and Language',
    curriculum: ['edexcel', 'cambridge'],
    grades: ['9', '10'],
    qualifications: [
      'BA in English (USJP)',
      'MA in Linguistics (University of Kelaniya)',
      'National Diploma in English (Advanced Technical Institute)'
    ],
  },
  {
    name: 'Hashini Perera',
    image: '/misc/teachers/hashini.jpg',
    subject: 'Economics, Business Studies, Commerce',
    curriculum: ['edexcel', 'cambridge'],
    grades: ['9', '10'],
    qualifications: [
      'CIMA Passed Finalist (Chartered Institute of Management Accountants)',
      'CIM Passed Finalist (Chartered Institute of Marketing)',
      'Former Auditor at KPMG',
      'Over 5+ years of teaching Edexcel/Cambridge curriculum'
    ],
  },
  {
    name: 'Tilak Gunaratne',
    image: '/misc/teachers/tilak.jpg',
    subject: 'Accounting',
    curriculum: ['edexcel', 'cambridge'],
    grades: ['9', '10'],
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
    image: '/misc/teachers/chathura.jpg',
    subject: 'Biology',
    curriculum: ['edexcel', 'cambridge'],
    grades: ['9', '10'],
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
    image: '/misc/teachers/roshan.jpg',
    subject: 'Computer Science',
    curriculum: ['edexcel', 'cambridge'],
    grades: ['9', '10'],
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
    image: '/misc/teachers/rohab.jpg',
    subject: 'Physics',
    curriculum: ['edexcel', 'cambridge'],
    grades: ['9', '10'],
    qualifications: [
      'B.Sc. (Hons) in Aircraft Maintenance Engineering (General Sir John Kotelawala Defense University)',
      '6 months training in Sri Lankan Airlines (B1.1 Engineering)',
      'Over 3+ years of teaching Edexcel/Cambridge curriculum'
    ],
  },
  {
    name: 'Shehan Cooray',
    image: '/misc/teachers/shehan.jpg',
    subject: 'Physics',
    curriculum: ['edexcel', 'cambridge'],
    grades: ['9', '10'],
    qualifications: [
      'Bachelor of Engineering (First Class) from the University of Bolton',
      'Full-Time Physics Teacher at a leading international school',
      'Full-Time Physics Lecturer at Pathfinder Academy, Ja-Ela',
      'Associate Member of IIESL and ECSL',
      'Over 8+ years of teaching Edexcel/Cambridge curriculum'
    ],
  },
];

const TutorCarousel = () => {
  const theme = useTheme();
  const [curriculum, setCurriculum] = useState('edexcel');
  const [grade, setGrade] = useState('9');

  const handleCurriculumChange = (
    _: React.MouseEvent<HTMLElement>,
    newCurriculum: string,
  ) => {
    if (newCurriculum !== null) {
      setCurriculum(newCurriculum);
    }
  };

  const handleGradeChange = (
    _: React.MouseEvent<HTMLElement>,
    newGrade: string,
  ) => {
    if (newGrade !== null) {
      setGrade(newGrade);
    }
  };

  // Filter tutors based on selected curriculum and grade
  const filteredTutors = tutors.filter(tutor => 
    tutor.curriculum.includes(curriculum) && tutor.grades.includes(grade)
  );

  return (
    <Box 
      id="tutors" 
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
              mb: { xs: 2, sm: 3 },
              color: 'primary.main',
              fontSize: { xs: '2.25rem', sm: '2.5rem' },
              px: { xs: 2, sm: 0 },
            }}
          >
            Meet Our Teachers
          </Typography>

          {/* Curriculum Toggle */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            mb: { xs: 4, sm: 6 },
          }}>
            <ToggleButtonGroup
              value={curriculum}
              exclusive
              onChange={handleCurriculumChange}
              aria-label="curriculum"
              sx={{
                mb: 2,
                '& .MuiToggleButton-root': {
                  px: { xs: 4, sm: 4 },
                  py: { xs: 1.5, sm: 1 },
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="cambridge" aria-label="cambridge">
                Cambridge
              </ToggleButton>
              <ToggleButton value="edexcel" aria-label="edexcel">
                Edexcel
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Grade Toggle */}
            <ToggleButtonGroup
              value={grade}
              exclusive
              onChange={handleGradeChange}
              aria-label="grade"
              sx={{
                '& .MuiToggleButton-root': {
                  px: { xs: 4, sm: 4 },
                  py: { xs: 1.5, sm: 1 },
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="9" aria-label="grade 9">
                Grade 9
              </ToggleButton>
              <ToggleButton value="10" aria-label="grade 10">
                Grade 10
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </motion.div>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {filteredTutors.map((tutor, index) => (
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
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at bottom right, rgba(25, 118, 210, 0.4), rgba(66, 165, 245, 0.1), rgba(25, 118, 210, 0), rgba(25, 118, 210, 0))',
                      backgroundSize: '200% 200%',
                      backgroundPosition: '0% 0%',
                      opacity: 0,
                      transition: 'all 0.5s ease-in-out',
                      zIndex: 0,
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'all 0.3s ease-in-out',
                      boxShadow: theme.palette.mode === 'dark' 
                        ? '0 8px 16px rgba(0,0,0,0.4)' 
                        : theme.shadows[8],
                      '&::before': {
                        opacity: 1,
                        backgroundPosition: '100% 100%',
                      }
                    },
                  }}
                >
                  <CardContent sx={{ 
                    p: { xs: 2, sm: 3 }, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: { xs: 1, sm: 2 },
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: { xs: 70, sm: 100, md: 120 },
                          height: { xs: 70, sm: 100, md: 120 },
                          borderRadius: '50%',
                          margin: '0 auto 0.75rem',
                          border: '4px solid',
                          borderColor: 'primary.light',
                          overflow: 'hidden',
                          backgroundColor: 'primary.main',
                        }}
                      >
                        <Box
                          component="img"
                          src={tutor.image}
                          alt={tutor.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                          }}
                          onError={(e) => {
                            const target = e.currentTarget;
                            const parent = target.parentElement;
                            if (!parent) return;

                            target.style.display = 'none';
                            parent.style.display = 'flex';
                            parent.style.alignItems = 'center';
                            parent.style.justifyContent = 'center';
                            parent.style.fontSize = '1.5rem';
                            parent.style.color = 'white';
                            parent.innerHTML = tutor.name.split(' ').map(n => n[0]).join('');
                          }}
                        />
                      </Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: { xs: 0.5, sm: 1 },
                          fontSize: { xs: '1.1rem', sm: '1.5rem' },
                        }}
                      >
                        {tutor.name}
                      </Typography>
                      <Typography 
                        variant="subtitle1" 
                        color="primary.main"
                        sx={{ 
                          fontWeight: 500, 
                          mb: { xs: 1.5, sm: 3 },
                          fontSize: { xs: '1rem', sm: '1rem' },
                        }}
                      >
                        {tutor.subject}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: { xs: 0, sm: 1 } }}>
                      {tutor.qualifications.map((qualification, idx) => (
                        <Typography 
                          key={idx} 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mb: { xs: 0.5, sm: 1 },
                            display: 'flex',
                            alignItems: 'flex-start',
                            textAlign: 'left',
                            fontSize: { xs: '0.9rem', sm: '0.875rem' },
                            lineHeight: { xs: 1.4, sm: 1.6 },
                            '&:before': {
                              content: '"•"',
                              marginRight: 1,
                              color: 'primary.main',
                              flexShrink: 0,
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

export default TutorCarousel; 