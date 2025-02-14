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
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { supabase } from '../services/supabase';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
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
              fontWeight: 400,
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
                  ? theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)'
                  : 'transparent',
              border: isToday && !hasEvent 
                ? `1px solid ${theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(0, 0, 0, 0.2)'}`
                : 'none',
              color: hasEvent 
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              fontSize: '0.9375rem',
              fontWeight: (hasEvent || isToday) ? 600 : 400,
              transition: 'all 0.2s ease',
              position: 'relative',
              '&:hover': {
                backgroundColor: hasEvent 
                  ? theme.palette.primary.light
                  : theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(0, 0, 0, 0.08)',
                transform: hasEvent ? 'scale(1.1)' : 'none',
              },
            }}
          >
            {day}
          </Box>
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

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        p: 3,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.02)',
        borderRadius: '16px',
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.1)'}`,
        backdropFilter: 'blur(8px)',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 20px 0 rgba(0,0,0,0.4)'
          : '0 4px 20px 0 rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 4,
      }}>
        <IconButton 
          onClick={() => handleMonthChange(-1)}
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <ChevronLeft />
        </IconButton>
        <Typography 
          variant="h6"
          onClick={resetToCurrentMonth}
          sx={{ 
            fontWeight: 500,
            fontSize: '1.25rem',
            color: theme.palette.text.primary,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton 
          onClick={() => handleMonthChange(1)}
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {renderCalendar()}

      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            maxWidth: '400px',
            width: '90%'
          }
        }}
      >
        {selectedEvent ? (
          <>
            <DialogTitle 
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                py: 2,
                px: 3,
                fontSize: '1.125rem',
                fontWeight: 500,
              }}
            >
              {selectedEvent.title}
            </DialogTitle>
            <DialogContent sx={{ mt: 2, p: 3 }}>
              <DialogContentText sx={{ 
                fontSize: '0.9375rem',
                color: theme.palette.text.primary,
              }}>
                {selectedEvent.description}
              </DialogContentText>
              <Typography 
                variant="body2"
                sx={{ 
                  mt: 3,
                  fontSize: '0.875rem',
                  color: theme.palette.text.secondary,
                }}
              >
                Date: {new Date(selectedEvent.event_date).toLocaleDateString()}
              </Typography>
            </DialogContent>
          </>
        ) : (
          <>
            <DialogTitle 
              sx={{ 
                py: 2,
                px: 3,
                fontSize: '1.125rem',
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              No Events
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <DialogContentText sx={{ 
                fontSize: '0.9375rem',
                color: theme.palette.text.secondary,
              }}>
                There are no events scheduled for this date.
              </DialogContentText>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Paper>
  );
};

export default Calendar; 