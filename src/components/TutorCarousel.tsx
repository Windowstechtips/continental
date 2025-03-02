import { Box, Container, Grid, Typography, Card, CardContent, useTheme, ToggleButtonGroup, ToggleButton, Avatar, Chip, Stack, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import TutorExpandedDialog from './TutorExpandedDialog';
import { TeacherContent } from '../types/database.types';
import { fetchTeachersContent } from '../services/supabase';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import FilterListIcon from '@mui/icons-material/FilterList';

const TutorCarousel = () => {
  const theme = useTheme();
  const [curriculum, setCurriculum] = useState('edexcel');
  const [grade, setGrade] = useState('9');
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
                  mb: { xs: 1, sm: 2 },
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
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: 'center',
                  maxWidth: '800px',
                  mx: 'auto',
                  mb: 4,
                  color: 'text.secondary',
                  px: { xs: 2, sm: 0 },
                }}
              >
                Our highly qualified teachers are dedicated to helping students achieve academic excellence
                through personalized instruction and innovative teaching methods.
              </Typography>
            </motion.div>
          </Box>

          {/* Filter Controls */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            mb: { xs: 4, sm: 6 },
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '100%',
              mb: 2
            }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton 
                  onClick={toggleFilters}
                  color="primary"
                  sx={{ 
                    mr: 2,
                    bgcolor: 'rgba(0, 86, 179, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 86, 179, 0.2)',
                    }
                  }}
                >
                  <FilterListIcon />
                </IconButton>
              </motion.div>
              
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filter Teachers
              </Typography>
            </Box>
            
            <AnimatePresence>
              {(showFilters || window.innerWidth > 600) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', overflow: 'hidden' }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 3,
                    width: '100%',
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(30, 30, 35, 0.6)'
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.05)',
                  }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: { xs: '100%', sm: 'auto' } }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                        Curriculum
                      </Typography>
                      <ToggleButtonGroup
                        value={curriculum}
                        exclusive
                        onChange={handleCurriculumChange}
                        aria-label="curriculum"
                        sx={{
                          width: { xs: '100%', sm: 'auto' },
                          '& .MuiToggleButton-root': {
                            px: { xs: 2, sm: 3 },
                            py: { xs: 1, sm: 1 },
                            fontSize: { xs: '0.9rem', sm: '0.9rem' },
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
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: { xs: '100%', sm: 'auto' } }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                        Grade Level
                      </Typography>
                      <ToggleButtonGroup
                        value={grade}
                        exclusive
                        onChange={handleGradeChange}
                        aria-label="grade"
                        sx={{
                          width: { xs: '100%', sm: 'auto' },
                          '& .MuiToggleButton-root': {
                            px: { xs: 2, sm: 3 },
                            py: { xs: 1, sm: 1 },
                            fontSize: { xs: '0.9rem', sm: '0.9rem' },
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
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
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