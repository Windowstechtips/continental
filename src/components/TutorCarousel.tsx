import { Box, Container, Grid, Typography, Card, CardContent, useTheme, ToggleButtonGroup, ToggleButton, Avatar, Chip, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import TutorExpandedDialog from './TutorExpandedDialog';
import { TeacherContent } from '../types/database.types';
import { fetchTeachersContent } from '../services/supabase';

const TutorCarousel = () => {
  const theme = useTheme();
  const [curriculum, setCurriculum] = useState('edexcel');
  const [grade, setGrade] = useState('9');
  const [selectedTutor, setSelectedTutor] = useState<TeacherContent | null>(null);
  const [teachers, setTeachers] = useState<TeacherContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeachers = async () => {
      setLoading(true);
      setError(null);
      try {
        const teachersData = await fetchTeachersContent();
        setTeachers(teachersData || []);
      } catch (error) {
        console.error('Error loading teachers:', error);
        setError('Failed to load teachers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

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

  const handleTutorClick = (tutor: TeacherContent) => {
    setSelectedTutor(tutor);
  };

  const handleCloseDialog = () => {
    setSelectedTutor(null);
  };

  // Parse grades and syllabi from string to array
  const parseTeacherData = (teacher: TeacherContent) => {
    const grades = teacher.grade ? teacher.grade.split(',').map(g => g.trim()) : [];
    const syllabi = teacher.syllabus ? teacher.syllabus.split(',').map(s => s.trim().toLowerCase()) : [];
    return { grades, syllabi };
  };

  // Filter tutors based on selected curriculum and grade
  const filteredTeachers = teachers.filter(teacher => {
    const { grades, syllabi } = parseTeacherData(teacher);
    const matchesSyllabus = curriculum === 'all' || syllabi.length === 0 || syllabi.includes(curriculum.toLowerCase());
    const matchesGrade = grade === 'all' || grades.length === 0 || grades.includes(grade);
    return matchesSyllabus && matchesGrade;
  });

  const renderQualifications = (teacher: TeacherContent) => {
    if (!teacher.qualifications || teacher.qualifications.length === 0) {
      return null;
    }

    return (
      <>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
          Qualifications:
        </Typography>
        {teacher.qualifications.map((qualification, idx) => (
          <Typography
            key={idx}
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 0.5,
              display: 'flex',
              alignItems: 'flex-start',
              fontSize: '0.8rem',
              lineHeight: 1.4,
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
      </>
    );
  };

  const renderTeacherPills = (teacher: TeacherContent) => {
    const { grades, syllabi } = parseTeacherData(teacher);
    
    // Combine consecutive grades
    const combinedGrades = grades.reduce((acc: string[], grade: string, i: number) => {
      const prevGrade = grades[i - 1];
      const lastGroup = acc[acc.length - 1];
      
      if (prevGrade && parseInt(grade) === parseInt(prevGrade) + 1) {
        // If this grade is consecutive with the previous one, combine them
        if (lastGroup.includes('&')) {
          // If already combined, just update the last number
          acc[acc.length - 1] = `Grade ${lastGroup.split('Grade ')[1].split(' & ')[0]} & ${grade}`;
        } else {
          // Create new combined grade
          acc[acc.length - 1] = `Grade ${prevGrade} & ${grade}`;
        }
      } else {
        // If not consecutive, add as new grade
        acc.push(`Grade ${grade}`);
      }
      return acc;
    }, []);

    // Combine syllabi if both exist
    const combinedSyllabi = syllabi.length === 2 ? ['Cambridge & Edexcel'] : syllabi;
    
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1, gap: 1 }}>
        {combinedGrades.map((g, index) => (
          <Chip
            key={`grade-${index}`}
            label={g}
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              fontSize: '0.75rem'
            }}
          />
        ))}
        {combinedSyllabi.map((s, index) => (
          <Chip
            key={`syllabus-${index}`}
            label={s.includes('&') ? s : s.charAt(0).toUpperCase() + s.slice(1)}
            size="small"
            sx={{
              background: s.includes('&') 
                ? 'linear-gradient(90deg, #f44336 -10%, #2196f3 110%)'
                : s.toLowerCase().includes('edexcel') 
                  ? '#2196f3'  // Edexcel blue
                  : '#f44336', // Cambridge red
              color: 'white',
              fontSize: '0.75rem',
              '&:hover': {
                background: s.includes('&')
                  ? 'linear-gradient(90deg, #d32f2f -10%, #1976d2 110%)'
                  : s.toLowerCase().includes('edexcel')
                    ? '#1976d2'  // Darker blue on hover
                    : '#d32f2f'  // Darker red on hover
              }
            }}
          />
        ))}
      </Stack>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <Typography>Loading teachers...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    if (!filteredTeachers || filteredTeachers.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <Typography>No teachers available for the selected filters.</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {filteredTeachers.map((teacher, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={teacher.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => handleTutorClick(teacher)}
              >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={teacher.picture_id ? `/misc/teachers/${teacher.picture_id}` : undefined}
                    alt={teacher.teacher_name}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                    }}
                    onError={(e) => {
                      console.error('Failed to load image:', e);
                      e.currentTarget.onerror = null;
                    }}
                  >
                    {teacher.teacher_name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ fontSize: '1.1rem' }}>
                      {teacher.teacher_name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" sx={{ fontSize: '0.9rem' }}>
                      {teacher.subject_name}
                    </Typography>
                    {renderTeacherPills(teacher)}
                  </Box>
                </Box>
                <CardContent sx={{ pt: 0, pb: 2 }}>
                  {renderQualifications(teacher)}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  };

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

          {/* Filter Controls */}
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
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                }
              }}
            >
              <ToggleButton value="all" aria-label="all curricula">
                All
              </ToggleButton>
              <ToggleButton value="edexcel" aria-label="edexcel">
                Edexcel
              </ToggleButton>
              <ToggleButton value="cambridge" aria-label="cambridge">
                Cambridge
              </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              value={grade}
              exclusive
              onChange={handleGradeChange}
              aria-label="grade"
              sx={{
                '& .MuiToggleButton-root': {
                  px: { xs: 3, sm: 3 },
                  py: { xs: 1.5, sm: 1 },
                  fontSize: { xs: '1.1rem', sm: '1rem' },
                  color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                }
              }}
            >
              <ToggleButton value="all" aria-label="all grades">
                All
              </ToggleButton>
              <ToggleButton value="9" aria-label="grade 9">
                Grade 9
              </ToggleButton>
              <ToggleButton value="10" aria-label="grade 10">
                Grade 10
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {renderContent()}
        </motion.div>
      </Container>

      {selectedTutor && (
        <TutorExpandedDialog
          tutor={selectedTutor}
          open={!!selectedTutor}
          onClose={handleCloseDialog}
        />
      )}
    </Box>
  );
};

export default TutorCarousel; 