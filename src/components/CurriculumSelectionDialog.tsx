import { useState, useEffect } from 'react';
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
  MenuItem,
  Select,
  InputLabel
} from '@mui/material';
import { motion } from 'framer-motion';

interface CurriculumSelectionDialogProps {
  open: boolean;
  onClose: (selectedData?: { curriculum: string; level: string; grade: string }) => void;
}

const CurriculumSelectionDialog = ({ open, onClose }: CurriculumSelectionDialogProps) => {
  const theme = useTheme();
  const [curriculum, setCurriculum] = useState('cambridge');
  const [level, setLevel] = useState('O/L');
  const [grade, setGrade] = useState('');
  
  // Set default grade based on level
  useEffect(() => {
    setGrade(level === 'O/L' ? '9' : '11');
  }, [level]);

  const handleSubmit = () => {
    // Save selections to localStorage
    localStorage.setItem('curriculum', curriculum);
    localStorage.setItem('level', level);
    localStorage.setItem('grade', grade);
    
    // Close dialog with selected data
    onClose({ curriculum, level, grade });
  };

  // Get available grades based on selected level
  const getGradeOptions = () => {
    return level === 'O/L' ? ['9', '10'] : ['11', '12'];
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10],
          px: 2
        }
      }}
    >
      <DialogTitle component="div">
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ 
            fontWeight: 600, 
            color: 'primary.main', 
            my: 2 
          }}
        >
          Welcome to Continental College
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Typography 
          variant="body1" 
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Please select your curriculum and grade to personalize your experience.
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 4, 
          justifyContent: 'center', 
          mb: 3 
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>Curriculum</FormLabel>
              <RadioGroup
                value={curriculum}
                onChange={(e) => setCurriculum(e.target.value)}
              >
                <FormControlLabel 
                  value="cambridge" 
                  control={
                    <Radio sx={{ 
                      color: 'primary.main',
                      '&.Mui-checked': { color: 'primary.main' }
                    }} />
                  } 
                  label="Cambridge" 
                />
                <FormControlLabel 
                  value="edexcel" 
                  control={
                    <Radio sx={{ 
                      color: 'primary.main',
                      '&.Mui-checked': { color: 'primary.main' }
                    }} />
                  } 
                  label="Edexcel" 
                />
              </RadioGroup>
            </FormControl>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{ width: '100%' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>Level</FormLabel>
                <RadioGroup
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <FormControlLabel 
                    value="O/L" 
                    control={
                      <Radio sx={{ 
                        color: 'primary.main',
                        '&.Mui-checked': { color: 'primary.main' }
                      }} />
                    } 
                    label="Ordinary Level (O/L)" 
                  />
                  <FormControlLabel 
                    value="A/L" 
                    control={
                      <Radio sx={{ 
                        color: 'primary.main',
                        '&.Mui-checked': { color: 'primary.main' }
                      }} />
                    } 
                    label="Advanced Level (A/L)" 
                  />
                </RadioGroup>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel id="grade-select-label">Grade</InputLabel>
                <Select
                  labelId="grade-select-label"
                  id="grade-select"
                  value={grade}
                  label="Grade"
                  onChange={(e) => setGrade(e.target.value)}
                >
                  {getGradeOptions().map((gradeOption) => (
                    <MenuItem key={gradeOption} value={gradeOption}>
                      Grade {gradeOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </motion.div>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2
          }}
        >
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CurriculumSelectionDialog; 