import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, useTheme, Paper } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

const MotionPaper = motion(Paper);

const ContactDialog = ({ open, onClose }: ContactDialogProps) => {
  const theme = useTheme();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperComponent={Paper}
      maxWidth="sm"
      fullWidth
    >
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        elevation={0}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          pb: 1,
          color: theme.palette.primary.main,
          fontWeight: 600,
        }}>
          Chat with Us
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            py: 2,
          }}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <WhatsAppIcon sx={{ fontSize: 64, color: '#25D366' }} />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 500 }}>
                Connect with us on WhatsApp
              </Typography>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                Our team is ready to assist you with any questions
              </Typography>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                href="https://chat.whatsapp.com/CeMhwDKaxjJ6J4McgOfesp"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mt: 2,
                  backgroundColor: '#25D366',
                  '&:hover': {
                    backgroundColor: '#128C7E',
                  },
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                }}
              >
                Open WhatsApp
              </Button>
            </motion.div>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Button 
              onClick={onClose} 
              color="primary"
              variant="outlined"
              sx={{ px: 4 }}
            >
              Close
            </Button>
          </motion.div>
        </DialogActions>
      </MotionPaper>
    </Dialog>
  );
};

export default ContactDialog; 