import { Dialog, DialogContent, Grid, Typography, IconButton, Box, useTheme, Divider, Avatar, Stack, Chip, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BiotechIcon from '@mui/icons-material/Biotech';
import ComputerIcon from '@mui/icons-material/Computer';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherContent } from '../types/database.types';

interface TutorExpandedDialogProps {
  open: boolean;
  onClose: () => void;
  tutor: TeacherContent;
}

const TutorExpandedDialog = ({ open, onClose, tutor }: TutorExpandedDialogProps) => {
  const theme = useTheme();

  console.log('TutorExpandedDialog rendered with props:', { open, tutor });

  const parseTeacherData = (teacher: TeacherContent) => {
    const grades = teacher.grade ? teacher.grade.split(',').map(g => g.trim()) : [];
    const syllabi = teacher.syllabus ? teacher.syllabus.split(',').map(s => s.trim().toLowerCase()) : [];
    return { grades, syllabi };
  };

  const renderTeacherPills = () => {
    const { grades, syllabi } = parseTeacherData(tutor);
    
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
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        sx={{
          gap: { xs: 0.75, sm: 1 },
          justifyContent: { xs: 'center', sm: 'flex-start' },
          alignItems: 'center'
        }}
      >
        {gradeDisplay.map((g, index) => (
          <Chip
            key={`grade-${index}`}
            label={g}
            size={window.innerWidth <= 600 ? "small" : "medium"}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.02em',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              py: { xs: 0.25, sm: 0.5 },
              px: { xs: 1, sm: 1.5 },
              height: { xs: 28, sm: 32 },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
              }
            }}
          />
        ))}
        {combinedSyllabi.map((s, index) => (
          <Chip
            key={`syllabus-${index}`}
            label={s.includes('&') ? s : s.charAt(0).toUpperCase() + s.slice(1)}
            size={window.innerWidth <= 600 ? "small" : "medium"}
            sx={{
              background: s.includes('&')
                ? 'linear-gradient(90deg, rgba(244, 67, 54, 0.8) 0%, rgba(33, 150, 243, 0.8) 100%)'
                : s.toLowerCase().includes('edexcel')
                  ? 'rgba(33, 150, 243, 0.8)'  // Edexcel blue
                  : 'rgba(244, 67, 54, 0.8)', // Cambridge red
              color: 'white',
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.02em',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              py: { xs: 0.25, sm: 0.5 },
              px: { xs: 1, sm: 1.5 },
              height: { xs: 28, sm: 32 },
              '&:hover': {
                background: s.includes('&')
                  ? 'linear-gradient(90deg, rgba(244, 67, 54, 0.9) 0%, rgba(33, 150, 243, 0.9) 100%)'
                  : s.toLowerCase().includes('edexcel')
                    ? 'rgba(33, 150, 243, 0.9)'
                    : 'rgba(244, 67, 54, 0.9)'
              }
            }}
          />
        ))}
      </Stack>
    );
  };

  const getSubjectIcon = (subject: string | null | undefined) => {
    if (!subject) return null;
    
    switch (subject.toLowerCase()) {
      case 'mathematics':
        return <CalculateIcon sx={{ fontSize: '2.5rem', mr: 2, color: 'white' }} />;
      case 'chemistry':
        return <ScienceIcon sx={{ fontSize: '2.5rem', mr: 2, color: 'white' }} />;
      case 'english literature and language':
        return <MenuBookIcon sx={{ fontSize: '2.5rem', mr: 2, color: 'white' }} />;
      case 'economics & business studies':
        return <BusinessIcon sx={{ fontSize: '2.5rem', mr: 2, color: 'white' }} />;
      case 'accounting':
        return <AccountBalanceIcon sx={{ fontSize: '2.5rem', mr: 2, color: 'white' }} />;
      case 'biology':
        return <BiotechIcon sx={{ fontSize: '2.5rem', mr: 2, color: 'white' }} />;
      case 'computer science':
        return <ComputerIcon sx={{ fontSize: '2.5rem', mr: 2, color: 'white' }} />;
      case 'physics':
        return <PrecisionManufacturingIcon sx={{ fontSize: '2.5rem', mr: 2, color: 'white' }} />;
      default:
        return <MenuBookIcon sx={{ fontSize: '2.5rem', mr: 2, color: 'white' }} />;
    }
  };

  const renderQualifications = () => {
    if (!tutor.qualifications || !Array.isArray(tutor.qualifications) || tutor.qualifications.length === 0) {
      return (
        <Typography
          variant="body1"
          sx={{
            mb: 1.5,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            color: 'text.secondary',
            fontStyle: 'italic'
          }}
        >
          No qualifications listed
        </Typography>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {tutor.qualifications.map((qualification, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Typography
              variant="body1"
              sx={{
                mb: 1.5,
                display: 'flex',
                alignItems: 'flex-start',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '&:before': {
                  content: '"•"',
                  marginRight: 1.5,
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateX(5px)',
                  color: 'primary.main',
                }
              }}
            >
              {qualification}
            </Typography>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderFormattedDescription = (text: string) => {
    const lines = text.split('\n');
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {lines.map((line, index) => {
          const titleMatch = line.match(/^#(.+)#$/);
          
          if (titleMatch) {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: 'primary.main',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    fontWeight: 700,
                    mt: index === 0 ? 0 : 3,
                    mb: 2,
                    background: 'linear-gradient(90deg, #0056b3, #64b5f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}
                >
                  {titleMatch[1].trim()}
                </Typography>
              </motion.div>
            );
          } else if (line.trim()) {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              >
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    mb: 1.5,
                    lineHeight: 1.7
                  }}
                >
                  {line}
                </Typography>
              </motion.div>
            );
          }
          return null;
        })}
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="lg"
          fullWidth
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: { xs: 1.5, sm: 3 }, // Reduced border radius on mobile
              bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#ffffff',
              overflow: 'hidden',
              margin: { xs: 0, sm: 3, md: 4 },
              maxHeight: { xs: '100%', sm: 'calc(100% - 48px)', md: 'calc(100% - 64px)' },
              height: { xs: '100%', sm: 'auto' },
              backgroundImage: 'none',
            },
            component: motion.div,
            initial: { opacity: 0, scale: 0.8, y: 60 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.8, y: 60 },
            transition: { duration: 0.4, ease: "easeOut" }
          }}
          sx={{
            '& .MuiDialog-container': {
              alignItems: { xs: 'flex-start', sm: 'center' },
              height: '100%',
            },
            backdropFilter: 'blur(8px)',
          }}
          BackdropProps={{
            sx: {
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(10, 25, 41, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)',
            }
          }}
          fullScreen={window.innerWidth <= 600}
        >
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: { xs: 8, sm: 16 },
              top: { xs: 8, sm: 16 },
              color: 'white',
              zIndex: 10,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Header Section - Outside DialogContent for fixed positioning */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
              p: { xs: 3, sm: 4, md: 5 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url(https://www.transparenttextures.com/patterns/cubes.png)',
                opacity: 0.1,
                zIndex: 0,
              },
            }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              position: 'relative',
              zIndex: 1,
              gap: { xs: 2, sm: 4 },
              width: '100%'
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0
              }}>
                <Avatar
                  src={
                    tutor.cloudinary_url ||
                    (tutor.picture_id?.includes('http') ? tutor.picture_id :
                     tutor.picture_id ?
                       tutor.picture_id.includes('/') ?
                         `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${tutor.picture_id}` :
                         `/misc/teachers/${tutor.picture_id}`
                       : undefined)
                  }
                  alt={tutor.teacher_name}
                  sx={{
                    width: { xs: 120, sm: 160 },
                    height: { xs: 120, sm: 160 },
                    bgcolor: 'primary.main',
                    fontSize: { xs: '2.5rem', sm: '3rem' },
                    border: '4px solid white',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  {tutor.teacher_name.charAt(0)}
                </Avatar>
              </Box>
              
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', sm: 'flex-start' },
                flex: 1,
                width: { xs: '100%', sm: 'auto' }
              }}>
                <Typography
                  variant="h4"
                  sx={{
                    mb: { xs: 1, sm: 1.5 },
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                    textAlign: { xs: 'center', sm: 'left' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    lineHeight: 1.2
                  }}
                >
                  {tutor.teacher_name}
                </Typography>
                
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 0.5, sm: 1.5 },
                  mb: { xs: 1.5, sm: 2 },
                  width: '100%'
                }}>
                  {getSubjectIcon(tutor.subject_name)}
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#E3F2FD',
                      fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      textAlign: { xs: 'center', sm: 'left' },
                      lineHeight: 1.2
                    }}
                  >
                    {tutor.subject_name}
                  </Typography>
                </Box>
                
                <Box sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  width: '100%',
                  mb: { xs: 2, sm: 3 }
                }}>
                  {renderTeacherPills()}
                </Box>
                
                {tutor.whatsapp_link && (
                  <Box sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    width: '100%'
                  }}>
                    <Button
                      variant="contained"
                      startIcon={<WhatsAppIcon />}
                      href={tutor.whatsapp_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        bgcolor: '#25D366',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#128C7E',
                        },
                        fontWeight: 600,
                        px: { xs: 2.5, sm: 3 },
                        py: { xs: 0.75, sm: 1 },
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      Contact via WhatsApp
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Scrollable Content Area */}
          <DialogContent
            sx={{
              p: { xs: 2, sm: 4, md: 5 },
              maxHeight: {
                xs: 'calc(100vh - 280px)',
                sm: 'calc(100vh - 320px)',
                md: 'calc(100vh - 350px)'
              },
              overflowY: 'auto',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.05)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '3px',
                '&:hover': {
                  background: 'rgba(0,0,0,0.3)',
                },
              },
            }}
          >
            <Grid container spacing={{ xs: 4, sm: 6 }}>
              <Grid item xs={12} md={4}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    mb: 3,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    fontWeight: 700,
                    textAlign: { xs: 'center', sm: 'left' },
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '40px',
                      height: '3px',
                      background: 'linear-gradient(90deg, #0056b3, #64b5f6)',
                      borderRadius: '3px',
                    }
                  }}
                >
                  Qualifications
                </Typography>
                {renderQualifications()}
              </Grid>

              <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12} md={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Divider 
                  orientation="vertical" 
                  flexItem 
                  sx={{ 
                    mx: 'auto',
                    height: '100%'
                  }} 
                />
              </Grid>

              <Grid item xs={12} md={7}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    mb: 3,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    fontWeight: 700,
                    textAlign: { xs: 'center', sm: 'left' },
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '40px',
                      height: '3px',
                      background: 'linear-gradient(90deg, #0056b3, #64b5f6)',
                      borderRadius: '3px',
                    }
                  }}
                >
                  About
                </Typography>
                {renderFormattedDescription(tutor.description)}
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default TutorExpandedDialog; 