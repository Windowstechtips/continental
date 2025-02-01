import { Dialog, DialogContent, Grid, Typography, IconButton, Box, useTheme, Divider, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BiotechIcon from '@mui/icons-material/Biotech';
import ComputerIcon from '@mui/icons-material/Computer';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherContent } from '../types/database.types';

interface TutorExpandedDialogProps {
  open: boolean;
  onClose: () => void;
  tutor: TeacherContent;
}

const TutorExpandedDialog = ({ open, onClose, tutor }: TutorExpandedDialogProps) => {
  const theme = useTheme();

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

    return tutor.qualifications.map((qualification, index) => (
      <Typography
        key={index}
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
        }}
      >
        {qualification}
      </Typography>
    ));
  };

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
              bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#ffffff',
              overflow: 'hidden',
              margin: { xs: 2, sm: 3, md: 4 },
              maxHeight: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 48px)', md: 'calc(100% - 64px)' },
            },
            component: motion.div,
            initial: { opacity: 0, scale: 0.8, y: 60 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.8, y: 60 },
            transition: { duration: 0.4, ease: "easeOut" }
          }}
          sx={{
            '& .MuiDialogContent-root': {
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
                '&:hover': {
                  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                },
              },
            },
          }}
        >
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: { xs: 4, sm: 8 },
              top: { xs: 4, sm: 8 },
              color: 'white',
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
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
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
                <Avatar
                  src={tutor.picture_id ? `/misc/teachers/${tutor.picture_id}` : undefined}
                  alt={tutor.teacher_name}
                  sx={{
                    width: { xs: 120, sm: 150 },
                    height: { xs: 120, sm: 150 },
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    border: '4px solid white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {tutor.teacher_name.charAt(0)}
                </Avatar>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: { xs: 'center', sm: 'flex-start' }
                }}>
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                      mb: 1, 
                      color: 'white', 
                      fontWeight: 500,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    {tutor.teacher_name}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 2 }
                  }}>
                    {getSubjectIcon(tutor.subject_name)}
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: '#E3F2FD',
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        textAlign: { xs: 'center', sm: 'left' }
                      }}
                    >
                      {tutor.subject_name}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Grid container spacing={{ xs: 2, sm: 4 }}>
                  {/* Left side - Qualifications */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      mb: 2,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      textAlign: { xs: 'center', sm: 'left' }
                    }}>
                      Qualifications
                    </Typography>
                    {renderQualifications()}
                  </Grid>

                  {/* Divider */}
                  <Divider 
                    orientation="vertical" 
                    flexItem 
                    sx={{ 
                      mx: 4,
                      display: { xs: 'none', md: 'block' }
                    }} 
                  />

                  {/* Right side - Description */}
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      mb: 2,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      textAlign: { xs: 'center', sm: 'left' }
                    }}>
                      Description
                    </Typography>
                    {renderFormattedDescription(tutor.description)}
                  </Grid>
                </Grid>
              </motion.div>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default TutorExpandedDialog; 