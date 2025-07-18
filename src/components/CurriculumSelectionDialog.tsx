import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  useTheme,
  Divider,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useCurriculum } from '../contexts/CurriculumContext';

interface CurriculumSelectionDialogProps {
  open: boolean;
  onClose: (selectedData?: { curriculum: string; selectedGrade: string }) => void;
}

const CurriculumSelectionDialog = ({ open, onClose }: CurriculumSelectionDialogProps) => {
  const theme = useTheme();
  const { setCurriculum, setSelectedGrade } = useCurriculum();
  const [curriculum, setCurriculumState] = useState('cambridge');
  const [selectedGrade, setSelectedGradeState] = useState('9');

  const handleSubmit = () => {
    // Update context with selected curriculum and grade
    setCurriculum(curriculum);
    setSelectedGrade(selectedGrade);
    
    // Close dialog with selected data
    onClose({ curriculum, selectedGrade });
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown
      hideBackdrop={false}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10],
          px: 2,
          py: 2,
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        },
        elevation: 24
      }}
    >
      <DialogTitle component="div">
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ 
            fontWeight: 700, 
            color: 'primary.main', 
            my: 2,
            fontSize: { xs: '1.75rem', sm: '2.25rem' }
          }}
        >
          Welcome to Continental College
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            fontWeight: 500,
            color: theme.palette.text.secondary
          }}
        >
          Please select your curriculum and grade to personalize your experience.
        </Typography>
        
        <Grid container spacing={4}>
          {/* Curriculum Selection */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  fontSize: '1.1rem',
                  color: theme.palette.primary.main
                }}>
                  Curriculum
                </FormLabel>
                <RadioGroup
                  value={curriculum}
                  onChange={(e) => setCurriculumState(e.target.value)}
                >
                  <FormControlLabel 
                    value="cambridge" 
                    control={
                      <Radio sx={{ 
                        color: 'primary.main',
                        '&.Mui-checked': { color: 'primary.main' }
                      }} />
                    } 
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Cambridge
                      </Typography>
                    }
                    sx={{ mb: 1.5, py: 0.5 }}
                  />
                  <FormControlLabel 
                    value="edexcel" 
                    control={
                      <Radio sx={{ 
                        color: 'primary.main',
                        '&.Mui-checked': { color: 'primary.main' }
                      }} />
                    } 
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Edexcel
                      </Typography>
                    }
                    sx={{ py: 0.5 }}
                  />
                </RadioGroup>
              </FormControl>
            </motion.div>
          </Grid>
          
          {/* Grade Selection */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  fontSize: '1.1rem',
                  color: theme.palette.primary.main
                }}>
                  Grade
                </FormLabel>
                <RadioGroup
                  value={selectedGrade}
                  onChange={(e) => setSelectedGradeState(e.target.value)}
                >
                  <FormControlLabel 
                    value="9" 
                    control={
                      <Radio sx={{ 
                        color: 'primary.main',
                        '&.Mui-checked': { color: 'primary.main' }
                      }} />
                    } 
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Grade 9
                      </Typography>
                    }
                    sx={{ mb: 1, py: 0.5 }}
                  />
                  <FormControlLabel 
                    value="10" 
                    control={
                      <Radio sx={{ 
                        color: 'primary.main',
                        '&.Mui-checked': { color: 'primary.main' }
                      }} />
                    } 
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Grade 10
                      </Typography>
                    }
                    sx={{ mb: 1, py: 0.5 }}
                  />
                  <FormControlLabel 
                    value="AS" 
                    control={
                      <Radio sx={{ 
                        color: 'primary.main',
                        '&.Mui-checked': { color: 'primary.main' }
                      }} />
                    } 
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        AS Level
                      </Typography>
                    }
                    sx={{ py: 0.5 }}
                  />
                </RadioGroup>
              </FormControl>
            </motion.div>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 4, pt: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          sx={{
            px: 5,
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2,
            fontSize: '1rem',
            boxShadow: theme.shadows[4]
          }}
        >
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CurriculumSelectionDialog; 