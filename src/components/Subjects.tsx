import { Box, Container, Grid, Typography, Card, CardContent, useTheme } from '@mui/material';
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
  const { curriculum, level, grade } = useCurriculum();

  // Fetch subject contents when component mounts
  useEffect(() => {
    const loadSubjectContents = async () => {
      try {
        const contents = await fetchSubjectsContent();
        console.log('Loaded subject contents:', contents);
        setSubjectContents(contents);
      } catch (error) {
        console.error('Error loading subject contents:', error);
      }
    };
    loadSubjectContents();
  }, []);

  const handleSubjectClick = async (subject: Subject) => {
    setIsLoading(true);
    try {
      // Find the matching content from our fetched data
      const content = subjectContents.find(
        content => content.subject_name.toLowerCase() === subject.name.toLowerCase()
      );
      
      console.log('Selected subject:', subject.name);
      console.log('Found content:', content);
      
      if (content) {
        setSelectedSubject({
          ...subject,
          content
        });
      } else {
        console.warn(`No content found for subject: ${subject.name}`);
        setSelectedSubject(subject);
      }
    } catch (error) {
      console.error('Error handling subject click:', error);
    } finally {
      setIsLoading(false);
    }
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
          
          {/* Display curriculum and grade selection */}
          {curriculum && level && grade && (
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                mb: { xs: 4, sm: 6 },
                color: 'text.secondary',
              }}
            >
              {curriculum.charAt(0).toUpperCase() + curriculum.slice(1)} Curriculum - {level} (Grade {grade})
            </Typography>
          )}
        </motion.div>

        <Grid container spacing={4}>
          {subjects.map((subject, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
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
                  onClick={() => handleSubjectClick(subject)}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Box
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
                            mb: 2,
                            boxShadow: '0 8px 16px rgba(0, 86, 179, 0.3)',
                          }}
                        >
                          <subject.icon sx={{ fontSize: '3rem', color: 'white' }} />
                        </Box>
                      </motion.div>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          textAlign: 'center',
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {subject.name}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <SubjectExpandedDialog
          open={!!selectedSubject}
          subject={selectedSubject || undefined}
          onClose={handleCloseDialog}
          loading={isLoading}
        />
      </Container>
    </Box>
  );
};

export default Subjects; 