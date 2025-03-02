import { Dialog, DialogContent, Typography, IconButton, Box, useTheme, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SvgIconComponent } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { SubjectContent } from '../types/database.types';

interface SubjectExpandedDialogProps {
  open: boolean;
  onClose: () => void;
  subject: {
    name: string;
    icon: SvgIconComponent;
    content?: SubjectContent;
  };
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

const SubjectExpandedDialog = ({ open, onClose, subject }: SubjectExpandedDialogProps) => {
  const theme = useTheme();

  const handleViewTeachers = () => {
    onClose();
    const element = document.getElementById('tutors');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Early return if no content
  if (!subject.content) {
    return null;
  }

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
              </Box>
            </Box>

            <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {/* Content */}
                <Box sx={{ mb: 4 }}>
                  {subject.content?.subject_description && renderFormattedDescription(subject.content.subject_description)}
                </Box>

                {/* Syllabus */}
                {subject.content?.whatsapp_link && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        fontWeight: 700,
                        mb: 2,
                        background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Additional Resources
                    </Typography>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(0, 0, 0, 0.2)' 
                        : 'rgba(0, 86, 179, 0.05)',
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 86, 179, 0.1)',
                    }}>
                      <Typography variant="body1">
                        Join our WhatsApp group for additional resources and updates about this subject.
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Call to Action */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  mt: 4,
                  pt: 3,
                  borderTop: '1px solid',
                  borderColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)',
                }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleViewTeachers}
                    sx={{
                      borderRadius: 8,
                      px: 3,
                      py: 1,
                      background: 'linear-gradient(90deg, #0056b3, #0077cc)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #003b7a, #0056b3)',
                      },
                      boxShadow: '0 4px 8px rgba(0, 86, 179, 0.3)',
                    }}
                  >
                    View Teachers
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<WhatsAppIcon />}
                    href={subject.content?.whatsapp_link || "https://wa.me/94777777777"}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      borderRadius: 8,
                      px: 3,
                      py: 1,
                      borderColor: '#25D366',
                      color: '#25D366',
                      '&:hover': {
                        borderColor: '#25D366',
                        bgcolor: 'rgba(37, 211, 102, 0.1)',
                      },
                    }}
                  >
                    Join WhatsApp Group
                  </Button>
                </Box>
              </motion.div>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SubjectExpandedDialog; 
