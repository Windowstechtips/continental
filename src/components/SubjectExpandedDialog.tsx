import { Dialog, DialogContent, Typography, IconButton, Box, useTheme, Button, Stack, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SvgIconComponent } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { SubjectContent } from '../types/database.types';
import { useCurriculum } from '../contexts/CurriculumContext';

interface SubjectExpandedDialogProps {
  open: boolean;
  onClose: () => void;
  subject: {
    name: string;
    icon: SvgIconComponent;
    content?: SubjectContent;
  } | null;
  loading?: boolean;
}

const renderFormattedDescription = (text: string) => {
  // Split the text by newlines to process each line
  const lines = text.split('\n');
  
  return lines.map((line, index) => {
    // Check if line contains a title (text between # symbols)
    const titleMatch = line.match(/^#(.+)#$/);
    
    if (titleMatch) {
      // If it's a title, render it with title styling
      return (
        <Typography
          key={index}
          variant="h5"
          sx={{
            color: 'primary.main',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 600,
            mt: index === 0 ? 0 : 3,
            mb: 2
          }}
        >
          {titleMatch[1].trim()}
        </Typography>
      );
    } else if (line.trim()) {
      // If it's regular text, render as paragraph
      return (
        <Typography
          key={index}
          variant="body1"
          paragraph
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            mb: 1.5
          }}
        >
          {line}
        </Typography>
      );
    }
    return null;
  });
};

const SubjectExpandedDialog = ({ open, onClose, subject, loading = false }: SubjectExpandedDialogProps) => {
  const theme = useTheme();
  const { curriculum, selectedGrade } = useCurriculum();
  
  console.log('SubjectExpandedDialog rendered with props:', { open, subject, loading });

  // Parse subject data to get curriculum and grade information
  const parseSubjectData = () => {
    if (!subject || !subject.content) return { grades: [], syllabi: [] };
    
    const grade = subject.content.grade ? [subject.content.grade] : [];
    const syllabus = subject.content.syllabus ? [subject.content.syllabus.toLowerCase()] : [];
    
    return { grades: grade, syllabi: syllabus };
  };

  // Generate appropriate description for subjects without specific curriculum or grade
  const getSubjectAvailabilityText = () => {
    if (!subject || !subject.content) {
      return `Related to Grade ${selectedGrade} ${curriculum.charAt(0).toUpperCase() + curriculum.slice(1)} & Cambridge`;
    }
    
    if (!subject.content.syllabus) {
      return `Related to Grade ${selectedGrade} ${curriculum.charAt(0).toUpperCase() + curriculum.slice(1)} & Cambridge`;
    }
    
    if (!subject.content.grade) {
      return `Related to All Grades ${subject.content.syllabus.charAt(0).toUpperCase() + subject.content.syllabus.slice(1)}`;
    }
    
    return null; // No special text needed for subjects with specific curriculum and grade
  };

  const handleViewTeachers = () => {
    onClose();
    const element = document.getElementById('tutors');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Early return if no subject
  if (!subject) {
    console.log('SubjectExpandedDialog: No subject provided');
    return null;
  }

  console.log('SubjectExpandedDialog: Rendering dialog with subject:', subject);
  
  const { grades, syllabi } = parseSubjectData();

  return (
    <AnimatePresence mode="wait">
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 35, 0.95)' : '#ffffff',
              overflow: 'hidden',
              margin: { xs: 2, sm: 3, md: 4 },
              maxHeight: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 48px)', md: 'calc(100% - 64px)' },
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)',
            },
            component: motion.div,
            initial: { opacity: 0, scale: 0.8, y: 60 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.8, y: 60 },
            transition: { duration: 0.4, ease: "easeOut" }
          }}
        >
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: { xs: 4, sm: 8 },
              top: { xs: 4, sm: 8 },
              color: 'text.primary',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Header with gradient background */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
                p: { xs: 2, sm: 3, md: 4 },
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)',
                  zIndex: 0,
                },
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'center' },
                position: 'relative', 
                zIndex: 1,
                gap: { xs: 2, sm: 3 }
              }}>
                <Box
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '3px solid white',
                    flexShrink: 0,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <subject.icon sx={{ fontSize: { xs: '2.5rem', sm: '3rem' }, color: 'white' }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600,
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    {subject.name}
                  </Typography>
                  
                  {/* Display grade and curriculum pills */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1, gap: 1 }}>
                    {grades.map((grade, index) => (
                      <Chip
                        key={`grade-${index}`}
                        label={`Grade ${grade}`}
                        size="medium"
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          backdropFilter: 'blur(4px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          letterSpacing: '0.02em',
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          py: 0.5,
                        }}
                      />
                    ))}
                    {syllabi.map((syllabus, index) => (
                      <Chip
                        key={`syllabus-${index}`}
                        label={syllabus.charAt(0).toUpperCase() + syllabus.slice(1)}
                        size="medium"
                        sx={{
                          background: syllabus.toLowerCase().includes('edexcel') 
                            ? 'rgba(33, 150, 243, 0.8)'  // Edexcel blue
                            : 'rgba(244, 67, 54, 0.8)', // Cambridge red
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          backdropFilter: 'blur(4px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          letterSpacing: '0.02em',
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          py: 0.5,
                        }}
                      />
                    ))}
                  </Stack>
                  
                  {/* Display availability text if needed */}
                  {getSubjectAvailabilityText() && (
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: 'white', 
                        opacity: 0.9,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        textAlign: { xs: 'center', sm: 'left' },
                        mt: 1,
                        fontStyle: 'italic'
                      }}
                    >
                      {getSubjectAvailabilityText()}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {/* Description */}
                {subject.content?.subject_description && (
                  <Box sx={{ mb: 4 }}>
                    {renderFormattedDescription(subject.content.subject_description)}
                  </Box>
                )}

                {/* WhatsApp Link */}
                {subject.content?.whatsapp_link && (
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<WhatsAppIcon />}
                      href={subject.content.whatsapp_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1rem',
                        textTransform: 'none',
                        bgcolor: '#25D366',
                        '&:hover': {
                          bgcolor: '#128C7E'
                        }
                      }}
                    >
                      Join WhatsApp Group for Updates
                    </Button>
                  </Box>
                )}
              </motion.div>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SubjectExpandedDialog; 
