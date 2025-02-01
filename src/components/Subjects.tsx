import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
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
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subjectContents, setSubjectContents] = useState<SubjectContent[]>([]);

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
        backgroundColor: theme => theme.palette.mode === 'dark' ? 'background.default' : '#f8f9fa',
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
              mb: { xs: 4, sm: 6 },
              color: 'primary.main',
              fontSize: { xs: '2.25rem', sm: '2.5rem' },
            }}
          >
            Our Subjects
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {subjects.map((subject, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
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
                    transition: 'transform 0.2s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: (theme) => theme.shadows[8],
                    },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
                    },
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
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                          mb: 2,
                        }}
                      >
                        <subject.icon sx={{ fontSize: '3rem', color: 'white' }} />
                      </Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          textAlign: 'center',
                          fontWeight: 600,
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

        {selectedSubject && (
          <SubjectExpandedDialog
            open={Boolean(selectedSubject)}
            onClose={handleCloseDialog}
            subject={selectedSubject}
          />
        )}
      </Container>
    </Box>
  );
};

export default Subjects; 