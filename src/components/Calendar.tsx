import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  useTheme,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Chip,
  alpha,
  Avatar,
  Divider,
  DialogActions,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Event, Close, CalendarMonth, LocationOn } from '@mui/icons-material';
import { supabase } from '../services/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location?: string;
}

const Calendar = () => {
  const theme = useTheme();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMonthChange = (increment: number) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + increment, 1));
  };

  const resetToCurrentMonth = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('event_date', startOfMonth.toISOString())
        .lte('event_date', endOfMonth.toISOString());

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }
      setEvents(data || []);
    };
    fetchEvents();
  }, [currentDate]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const event = events.find(e => new Date(e.event_date).toDateString() === clickedDate.toDateString());
    setSelectedEvent(event || null);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Header row with weekday labels
    const headerRow = (
      <Box sx={{ display: 'flex', mb: 3 }}>
        {weekDays.map((day, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              textAlign: 'center',
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            {day}
          </Box>
        ))}
      </Box>
    );

    // Calendar grid
    const rows = [];
    let cells = [];
    
    // Empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <Box
          key={`empty-${i}`}
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
          }}
        />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const hasEvent = events.some(e => new Date(e.event_date).toDateString() === date.toDateString());
      const isToday = new Date().toDateString() === date.toDateString();

      cells.push(
        <Box
          key={day}
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            position: 'relative',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              onClick={() => handleDayClick(day)}
              sx={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '50%',
                backgroundColor: hasEvent 
                  ? theme.palette.primary.main
                  : isToday 
                    ? alpha(theme.palette.primary.main, 0.1)
                    : 'transparent',
                border: isToday && !hasEvent 
                  ? `2px solid ${theme.palette.primary.main}`
                  : 'none',
                color: hasEvent 
                  ? theme.palette.primary.contrastText
                  : isToday
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                fontSize: '0.9375rem',
                fontWeight: (hasEvent || isToday) ? 600 : 400,
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: hasEvent ? '0 4px 8px rgba(0, 86, 179, 0.25)' : 'none',
                '&:hover': {
                  backgroundColor: hasEvent 
                    ? theme.palette.primary.dark
                    : alpha(theme.palette.primary.main, 0.15),
                  boxShadow: hasEvent ? '0 6px 12px rgba(0, 86, 179, 0.3)' : 'none',
                },
              }}
            >
              {day}
            </Box>
          </motion.div>
        </Box>
      );

      if (cells.length === 7) {
        rows.push(
          <Box key={day} sx={{ display: 'flex', mb: 1 }}>
            {cells}
          </Box>
        );
        cells = [];
      }
    }

    // Add remaining cells
    if (cells.length > 0) {
      rows.push(
        <Box key="last-row" sx={{ display: 'flex', mb: 1 }}>
          {cells}
          {[...Array(7 - cells.length)].map((_, i) => (
            <Box
              key={`empty-end-${i}`}
              sx={{
                flex: 1,
                height: 40,
              }}
            />
          ))}
        </Box>
      );
    }

    return (
      <>
        {headerRow}
        {rows}
      </>
    );
  };

  const handleCloseEventDialog = () => {
    setSelectedEvent(null);
    setIsDialogOpen(false);
  };

  return (
    <Paper
      elevation={0}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        width: '100%',
        p: 3,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(30, 30, 35, 0.6)'
          : alpha(theme.palette.background.paper, 0.6),
        borderRadius: '16px',
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.mode === 'dark' 
          ? alpha(theme.palette.divider, 0.1)
          : alpha(theme.palette.divider, 0.1)}`,
        backdropFilter: 'blur(10px)',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 8px 32px rgba(0, 0, 0, 0.2)'
          : '0 8px 32px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.97)'
          : 'rgba(248, 250, 255, 0.8)',
        p: { xs: 2, sm: 3 },
        borderRadius: '16px',
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
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 4,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mr: 2,
              }}
            >
              <CalendarMonth />
            </Avatar>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton 
                onClick={() => handleMonthChange(-1)}
                sx={{ 
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton 
                onClick={() => handleMonthChange(1)}
                sx={{ 
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <ChevronRight />
              </IconButton>
            </motion.div>
          </Box>
        </Box>

        {renderCalendar()}

        <Dialog
          open={Boolean(selectedEvent)}
          onClose={handleCloseEventDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 35, 0.95)' : '#ffffff',
              overflow: 'hidden',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)',
            },
            component: motion.div,
            initial: { opacity: 0, scale: 0.9, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 20 },
            transition: { duration: 0.3 }
          }}
        >
          {selectedEvent && (
            <>
              <Box sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
                position: 'relative',
              }}>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseEventDialog}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'white',
                  }}
                >
                  <Close />
                </IconButton>
                
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                  {selectedEvent.title}
                </Typography>
                
                <Chip 
                  label={new Date(selectedEvent.event_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                  icon={<CalendarMonth sx={{ color: 'white !important' }} />}
                />
              </Box>
              
              <DialogContent sx={{ p: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Typography variant="body1" paragraph>
                    {selectedEvent.description}
                  </Typography>
                  
                  {selectedEvent.location && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      mt: 2,
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
                      <LocationOn color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedEvent.location}
                      </Typography>
                    </Box>
                  )}
                </motion.div>
              </DialogContent>
              
              <DialogActions sx={{ 
                p: 2, 
                borderTop: '1px solid',
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)',
              }}>
                <Button 
                  onClick={handleCloseEventDialog}
                  sx={{ 
                    borderRadius: 8,
                    px: 3,
                  }}
                >
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{
                    borderRadius: 8,
                    px: 3,
                    background: 'linear-gradient(90deg, #0056b3, #0077cc)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #003b7a, #0056b3)',
                    },
                    boxShadow: '0 4px 8px rgba(0, 86, 179, 0.3)',
                  }}
                >
                  Add to Calendar
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Paper>
  );
};

export default Calendar; 