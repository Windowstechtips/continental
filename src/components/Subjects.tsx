import { Box, Container, Grid, Typography, Card, CardContent, useTheme, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BiotechIcon from '@mui/icons-material/Biotech';
import ComputerIcon from '@mui/icons-material/Computer';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { useState, useEffect } from 'react';
import SubjectExpandedDialog from './SubjectExpandedDialog';
import { fetchSubjectsContent } from '../services/supabase';
import type { SubjectContent } from '../types/database.types';
import { useCurriculum } from '../contexts/CurriculumContext';

interface Subject {
  name: string;
  icon: typeof CalculateIcon;
  content?: SubjectContent;
}

const subjects: Subject[] = [
  {
    name: 'Mathematics',
    icon: CalculateIcon,
  },
  {
    name: 'Chemistry',
    icon: ScienceIcon,
  },
  {
    name: 'English Literature and Language',
    icon: MenuBookIcon,
  },
  {
    name: 'Economics & Business Studies',
    icon: BusinessIcon,
  },
  {
    name: 'Accounting',
    icon: AccountBalanceIcon,
  },
  {
    name: 'Biology',
    icon: BiotechIcon,
  },
  {
    name: 'Computer Science',
    icon: ComputerIcon,
  },
  {
    name: 'Physics',
    icon: PrecisionManufacturingIcon,
  },
];

const Subjects = () => {
  const theme = useTheme();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subjectContents, setSubjectContents] = useState<SubjectContent[]>([]);
  const { curriculum, selectedGrade, isInitialized } = useCurriculum();

  // Fetch subject contents when component mounts or when curriculum/grade changes
  useEffect(() => {
    const loadSubjectContents = async () => {
      try {
        // Pass curriculum and grade to get filtered results from Supabase
        const contents = await fetchSubjectsContent(curriculum, selectedGrade);
        console.log('Loaded filtered subject contents:', contents);
        console.log('Current curriculum:', curriculum, 'Current grade:', selectedGrade);
        setSubjectContents(contents);
      } catch (error) {
        console.error('Error loading subject contents:', error);
      }
    };
    
    // Load data once the curriculum context is initialized
    if (isInitialized && curriculum && selectedGrade) {
      loadSubjectContents();
    }
  }, [curriculum, selectedGrade, isInitialized]);

  // Map subjects with their content (no client-side filtering needed since Supabase does it)
  const filteredSubjects = subjects.map(subject => {
    const content = subjectContents.find(
      content => content.subject_name.toLowerCase().trim() === subject.name.toLowerCase().trim()
    );
    return {
      ...subject,
      content
    };
  }).filter(subject => subject.content); // Only show subjects that have matching content from database

  // Generate appropriate description for subjects without specific curriculum or grade
  const getSubjectAvailabilityText = (subject: Subject) => {
    if (!subject.content) {
      const curr = curriculum.charAt(0).toUpperCase() + curriculum.slice(1);
      return `Related to Grade ${selectedGrade} ${curr}`;
    }

    // If no syllabus, fallback to selected curriculum
    if (!subject.content.syllabus) {
      const curr = curriculum.charAt(0).toUpperCase() + curriculum.slice(1);
      return `Related to Grade ${selectedGrade} ${curr}`;
    }

    // Only show syllabus if it matches the selected curriculum
    if (subject.content.syllabus.toLowerCase().trim() === curriculum.toLowerCase().trim()) {
      if (subject.content.grade) {
        return `Related to Grade ${subject.content.grade} ${subject.content.syllabus.charAt(0).toUpperCase() + subject.content.syllabus.slice(1)}`;
      }
      return `Related to All Grades ${subject.content.syllabus.charAt(0).toUpperCase() + subject.content.syllabus.slice(1)}`;
    }

    // If syllabus does not match selected curriculum, show nothing
    return null;
  };

  const handleSubjectClick = (subject: Subject) => {
    console.log('handleSubjectClick called with:', subject);
    setSelectedSubject(subject);
  };

  const handleCloseDialog = () => {
    setSelectedSubject(null);
  };

  return (
    <Box
      id="subjects"
      sx={{
        py: { xs: 6, sm: 8 },
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.97)' 
          : '#f8f9fa',
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
              fontSize: { xs: '2.25rem', sm: '2.75rem' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              px: { xs: 2, sm: 0 },
            }}
          >
            Our Subjects
          </Typography>
          
          {/* Display curriculum and grade selection as pills */}
          {curriculum && selectedGrade && (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mb: { xs: 4, sm: 6 } }}
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
        </motion.div>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {filteredSubjects.map((subject, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card
                  onClick={() => {
                    handleSubjectClick(subject);
                  }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'visible',
                    borderRadius: '12px',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.2)'
                      : '0 8px 32px rgba(0, 0, 0, 0.05)',
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(30, 30, 35, 0.6)'
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
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
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, position: 'relative' }}>
                    {/* WhatsApp Button */}
                    {subject.content?.whatsapp_link && (
                      <Tooltip title="Contact via WhatsApp" placement="top">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(subject.content.whatsapp_link, '_blank');
                          }}
                          sx={{
                            position: 'absolute',
                            top: { xs: 8, sm: 12 },
                            right: { xs: 8, sm: 12 },
                            backgroundColor: '#25D366',
                            color: 'white',
                            width: { xs: 36, sm: 40 },
                            height: { xs: 36, sm: 40 },
                            '&:hover': {
                              backgroundColor: '#128C7E',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
                          }}
                        >
                          <WhatsAppIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: 2
                      }}
                    >
                      <Box
                        component={subject.icon}
                        sx={{
                          fontSize: { xs: 40, sm: 48 },
                          color: theme.palette.primary.main,
                          mb: { xs: 1.5, sm: 2 }
                        }}
                      />
                      <Typography
                        variant="h6"
                        component="h3"
                        align="center"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          lineHeight: 1.3,
                        }}
                      >
                        {subject.name}
                      </Typography>
                      
                      {/* Render availability text */}
                      {getSubjectAvailabilityText(subject) && (
                        <Typography
                          variant="caption"
                          align="center"
                          sx={{
                            mt: 0.5,
                            color: theme.palette.text.secondary,
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            fontStyle: 'italic',
                            lineHeight: 1.2,
                          }}
                        >
                          {getSubjectAvailabilityText(subject)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {selectedSubject && (
        <SubjectExpandedDialog
          open={true}
          subject={selectedSubject}
          onClose={handleCloseDialog}
          loading={isLoading}
        />
      )}
    </Box>
  );
};

export default Subjects; 