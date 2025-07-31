import { Box, Container, Grid, Typography, Card, CardContent, useTheme, ToggleButtonGroup, ToggleButton, Avatar, Chip, Stack, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import TutorExpandedDialog from './TutorExpandedDialog';
import { TeacherContent } from '../types/database.types';
import { fetchTeachersContent } from '../services/supabase';
import { useCurriculum } from '../contexts/CurriculumContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import FilterListIcon from '@mui/icons-material/FilterList';

const TutorCarousel = () => {
  const theme = useTheme();
  const { curriculum, selectedGrade: grade, isInitialized } = useCurriculum();
  const [selectedTutor, setSelectedTutor] = useState<TeacherContent | null>(null);
  const [teachers, setTeachers] = useState<TeacherContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadTeachers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Pass curriculum and grade to get filtered results from Supabase
        const teachersData = await fetchTeachersContent(curriculum, grade);
        console.log('TutorCarousel - Loaded filtered teachers:', teachersData);
        console.log('TutorCarousel - Current curriculum:', curriculum, 'Current grade:', grade);
        setTeachers(teachersData || []);
      } catch (error) {
        console.error('Error loading teachers:', error);
        setError('Failed to load teachers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Load data once the curriculum context is initialized
    if (isInitialized && curriculum && grade) {
      loadTeachers();
    }
  }, [curriculum, grade, isInitialized]);

  const handleTutorClick = (tutor: TeacherContent) => {
    setSelectedTutor(tutor);
  };

  const handleCloseDialog = () => {
    setSelectedTutor(null);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Parse grades and syllabi from string to array (for display purposes)
  const parseTeacherData = (teacher: TeacherContent) => {
    const grades = teacher.grade ? teacher.grade.split(',').map(g => g.trim()) : [];
    const syllabi = teacher.syllabus ? teacher.syllabus.split(',').map(s => s.trim().toLowerCase()) : [];
    return { grades, syllabi };
  };

  // No client-side filtering needed since Supabase does the filtering
  const filteredTeachers = teachers;

  const renderQualifications = (teacher: TeacherContent) => {
    if (!teacher.qualifications || teacher.qualifications.length === 0) {
      return null;
    }

    return (
      <>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 1, fontWeight: 600 }}>
          Qualifications
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
    
    // Sort grades to have numeric grades first, then special grades like 'AS'
    const sortedGrades = [...grades].sort((a, b) => {
      const aIsNumber = !isNaN(parseInt(a));
      const bIsNumber = !isNaN(parseInt(b));
      
      if (aIsNumber && !bIsNumber) return -1;
      if (!aIsNumber && bIsNumber) return 1;
      return parseInt(a) - parseInt(b);
    });
    
    // Group numeric grades
    const numericGrades: string[] = [];
    const specialGrades: string[] = [];
    
    sortedGrades.forEach(grade => {
      if (!isNaN(parseInt(grade))) {
        numericGrades.push(grade);
      } else {
        specialGrades.push(grade);
      }
    });
    
    // Combine consecutive numeric grades
    const combinedNumericGrades = numericGrades.reduce((acc: string[], grade: string, i: number) => {
      const prevGrade = numericGrades[i - 1];
      const lastGroup = acc[acc.length - 1];
      
      if (prevGrade && parseInt(grade) === parseInt(prevGrade) + 1) {
        // If this grade is consecutive with the previous one, combine them
        if (lastGroup && lastGroup.includes('&')) {
          // If already combined, just update the last number
          acc[acc.length - 1] = `${lastGroup.split(' & ')[0]} & ${grade}`;
        } else {
          // Create new combined grade
          acc[acc.length - 1] = `${prevGrade} & ${grade}`;
        }
      } else {
        // If not consecutive, add as new grade
        acc.push(grade);
      }
      return acc;
    }, []);
    
    // Create final grade display string
    let gradeDisplay: string[] = [];
    
    if (combinedNumericGrades.length > 0) {
      gradeDisplay = combinedNumericGrades.map(g => 
        g.includes('&') ? `Grade ${g}` : `Grade ${g}`
      );
    }
    
    // Add special grades (like AS) to the last numeric grade group if it exists
    if (specialGrades.length > 0 && gradeDisplay.length > 0) {
      const lastIndex = gradeDisplay.length - 1;
      gradeDisplay[lastIndex] = `${gradeDisplay[lastIndex]} & ${specialGrades.join(', ')}`;
    } else if (specialGrades.length > 0) {
      // If no numeric grades, just add the special grades
      gradeDisplay = specialGrades.map(g => `Grade ${g}`);
    }

    // Combine syllabi if both exist
    const combinedSyllabi = syllabi.length === 2 ? ['Cambridge & Edexcel'] : syllabi;
    
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1, gap: 1 }}>
        {gradeDisplay.map((g, index) => (
          <Chip
            key={`grade-${index}`}
            label={g}
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 86, 179, 0.1)',
              color: theme.palette.primary.main,
              fontSize: '0.75rem',
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: 'rgba(0, 86, 179, 0.15)',
              }
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
                ? 'linear-gradient(90deg, rgba(244, 67, 54, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)'
                : s.toLowerCase().includes('edexcel') 
                  ? 'rgba(33, 150, 243, 0.1)'  // Edexcel blue
                  : 'rgba(244, 67, 54, 0.1)', // Cambridge red
              color: s.includes('&')
                ? theme.palette.mode === 'dark' ? '#fff' : '#333'
                : s.toLowerCase().includes('edexcel')
                  ? theme.palette.primary.main
                  : '#d32f2f',
              fontSize: '0.75rem',
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
              '&:hover': {
                background: s.includes('&')
                  ? 'linear-gradient(90deg, rgba(244, 67, 54, 0.15) 0%, rgba(33, 150, 243, 0.15) 100%)'
                  : s.toLowerCase().includes('edexcel')
                    ? 'rgba(33, 150, 243, 0.15)'
                    : 'rgba(244, 67, 54, 0.15)'
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
          minHeight: '300px'
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              color: 'text.secondary'
            }}>
              <motion.div
                animate={{ 
                  rotate: 360,
                  transition: { 
                    repeat: Infinity, 
                    duration: 1.5, 
                    ease: "linear" 
                  }
                }}
              >
                <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
              </motion.div>
              Loading teachers...
            </Typography>
          </motion.div>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '300px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography color="error" variant="h6">{error}</Typography>
          </motion.div>
        </Box>
      );
    }

    if (!filteredTeachers || filteredTeachers.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '300px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" color="text.secondary">
              No teachers available for the selected filters.
            </Typography>
          </motion.div>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {filteredTeachers.map((teacher, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={teacher.id}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -10 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'visible',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: 'linear-gradient(90deg, #0056b3, #64b5f6)',
                    borderRadius: '12px 12px 0 0',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -5,
                    left: -5,
                    right: -5,
                    bottom: -5,
                    background: 'linear-gradient(135deg, rgba(0,86,179,0.2) 0%, rgba(100,181,246,0.2) 100%)',
                    borderRadius: '16px',
                    opacity: 0,
                    zIndex: -1,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover::after': {
                    opacity: 1,
                  }
                }}
                onClick={() => handleTutorClick(teacher)}
              >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={
                      teacher.cloudinary_url || 
                      (teacher.picture_id?.includes('http') ? teacher.picture_id : 
                       teacher.picture_id ? 
                        teacher.picture_id.includes('/') ? 
                          `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${teacher.picture_id}` : 
                          `/misc/teachers/${teacher.picture_id}` 
                        : undefined)
                    }
                    alt={teacher.teacher_name}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      border: '3px solid white',
                      boxShadow: '0 4px 12px rgba(0,86,179,0.3)',
                    }}
                    imgProps={{
                      onError: () => {
                        console.error('Failed to load teacher image:', {
                          teacherName: teacher.teacher_name,
                          cloudinaryUrl: teacher.cloudinary_url,
                          pictureId: teacher.picture_id,
                          attemptedSrc: teacher.cloudinary_url || 
                            (teacher.picture_id?.includes('http') ? teacher.picture_id : 
                             teacher.picture_id ? 
                              teacher.picture_id.includes('/') ? 
                                `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${teacher.picture_id}` : 
                                `/misc/teachers/${teacher.picture_id}` 
                              : 'none')
                        });
                      }
                    }}
                  >
                    {teacher.teacher_name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'text.primary',
                      }}
                    >
                      {teacher.teacher_name}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="primary" 
                      sx={{ 
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        mb: 0.5
                      }}
                    >
                      {teacher.subject_name}
                    </Typography>
                    {renderTeacherPills(teacher)}
                  </Box>
                </Box>
                <CardContent sx={{ pt: 0, pb: 2, flex: 1 }}>
                  {renderQualifications(teacher)}
                </CardContent>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(19, 47, 76, 0.4)'
                      : 'rgba(248, 250, 255, 0.8)',
                  }}
                >
                  <motion.div whileHover={{ x: 5 }}>
                    <Typography 
                      variant="button" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 0.5,
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}
                    >
                      More Info <ArrowForwardIcon fontSize="small" />
                    </Typography>
                  </motion.div>
                </Box>
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
        py: { xs: 8, sm: 10 },
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.97)'
          : 'rgba(248, 250, 255, 0.8)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #0056b3, #64b5f6)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #64b5f6, #0056b3)',
        }
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5 } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h2"
                sx={{
                  textAlign: 'center',
                  mb: { xs: 4, sm: 5 },
                  fontSize: { xs: '2.25rem', sm: '2.75rem' },
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  px: { xs: 2, sm: 0 },
                }}
              >
                Meet Our Teachers
              </Typography>
            </motion.div>
          </Box>

          {renderContent()}
        </motion.div>
      </Container>
      
      {selectedTutor && (
        <TutorExpandedDialog
          open={true}
          onClose={handleCloseDialog}
          tutor={selectedTutor}
        />
      )}
    </Box>
  );
};

export default TutorCarousel; 