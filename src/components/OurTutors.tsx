import { Box, Container, Grid, Typography, Card, CardContent, useTheme, Avatar, Chip, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchTeachersContent } from '../services/supabase';
import { TeacherContent } from '../types/database.types';
import { useCurriculum } from '../contexts/CurriculumContext';

const OurTutors = () => {
  const theme = useTheme();
  const { curriculum, selectedGrade, isInitialized } = useCurriculum();
  const [teachers, setTeachers] = useState<TeacherContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        // Pass curriculum and grade to get filtered results from Supabase
        const teachersData = await fetchTeachersContent(curriculum, selectedGrade);
        console.log('Loaded filtered teachers:', teachersData);
        console.log('Current curriculum:', curriculum, 'Current grade:', selectedGrade);
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error loading teachers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load data once the curriculum context is initialized
    if (isInitialized && curriculum && selectedGrade) {
      setIsLoading(true);
      loadTeachers();
    }
  }, [curriculum, selectedGrade, isInitialized]);

  // No client-side filtering needed since Supabase does the filtering
  const filteredTeachers = teachers;

  // Log results for debugging
  console.log('Teachers from Supabase:', {
    currentCurriculum: curriculum,
    currentGrade: selectedGrade,
    totalTeachers: teachers.length,
    teachers: teachers.map(t => ({
      name: t.teacher_name,
      syllabus: t.syllabus,
      grade: t.grade
    }))
  });

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
              mb: 3,
              color: 'primary.main',
            }}
          >
            Our Expert Tutors
          </Typography>

          {/* Display curriculum and grade selection as pills */}
          {curriculum && selectedGrade && (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mb: 6 }}
            >
              <Chip
                label={`Grade ${selectedGrade}`}
                color="primary"
                sx={{
                  borderRadius: '16px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              />
              <Chip
                label={curriculum.charAt(0).toUpperCase() + curriculum.slice(1)}
                color="secondary"
                sx={{
                  borderRadius: '16px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              />
            </Stack>
          )}

          {/* Show message when no teachers match the filter */}
          {filteredTeachers.length === 0 && !isLoading && (
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                mb: 3,
                color: 'text.secondary',
              }}
            >
              No tutors available for {curriculum} Grade {selectedGrade}.
            </Typography>
          )}
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          {filteredTeachers.map((teacher, index) => (
            <Grid item xs={12} sm={6} md={4} key={teacher.id}>
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
                      {teacher.cloudinary_url ? (
                        <Avatar 
                          src={teacher.cloudinary_url}
                          sx={{ width: 60, height: 60 }}
                        />
                      ) : (
                        <Avatar 
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            bgcolor: 'primary.main',
                            fontSize: '1.5rem',
                          }}
                        >
                          {teacher.teacher_name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {teacher.teacher_name}
                        </Typography>
                        <Chip 
                          label={teacher.subject_name} 
                          color="primary" 
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      {teacher.qualifications.map((qualification, idx) => (
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