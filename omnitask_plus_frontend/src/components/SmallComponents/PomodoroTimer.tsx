import { useState, useEffect } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import useSound from 'use-sound';
import peepSound from '../../sounds/alarm_peep.wav'; // Importing a sound file for the alarm

// PomodoroTimer component definition
const PomodoroTimer = ({className}: {className?: string}) => {
  // State hooks for managing the timer's open state, time, active state, and interval ID
  const [open, setOpen] = useState(false);
  const userId = sessionStorage.getItem('userId'); // Retrieving the userId from sessionStorage
  // State for managing time, retrieving from sessionStorage or setting default (25 minutes)
  const [time, setTime] = useState(() => {
    const savedTime = sessionStorage.getItem(`pomodoroTime_${userId}`);
    return savedTime ? parseInt(savedTime, 10) : 25 * 60;
  });
  // State for managing whether the timer is active, retrieving from sessionStorage or setting default
  const [isActive, setIsActive] = useState(() => {
    const savedIsActive = sessionStorage.getItem(`pomodoroIsActive_${userId}`);
    return savedIsActive ? savedIsActive === 'true' : false;
  });
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [play] = useSound(peepSound, { interrupt: true }); // Hook for playing sound

  // Function to toggle the timer's active state and manage sessionStorage
  const toggle = () => {
    setIsActive(!isActive);
    sessionStorage.setItem(`pomodoroIsActive_${userId}`, (!isActive).toString());
    if (!isActive && time > 0) {
      const id = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime >= 0) {
            sessionStorage.setItem(`pomodoroTime_${userId}`, newTime.toString());
            return newTime;
          } else {
            clearInterval(id);
            return 0;
          }
        });
      }, 1000);
      setIntervalId(id);
    } else {
      if (intervalId) clearInterval(intervalId);
    }
  };

  // Function to reset the timer to its default state and manage sessionStorage
  const reset = () => {
    setTime(25 * 60);
    sessionStorage.setItem(`pomodoroTime_${userId}`, (25 * 60).toString());
    setIsActive(false);
    sessionStorage.setItem(`pomodoroIsActive_${userId}`, 'false');
    if (intervalId) clearInterval(intervalId);
  };

  // Function to handle closing the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Effect hook to manage actions when time reaches 0
  useEffect(() => {
    if (time === 0) {
      setIsActive(false);
      sessionStorage.setItem(`pomodoroIsActive_${userId}`, 'false');
      setOpen(true);
      if (intervalId) clearInterval(intervalId);
      play();
    }
  }, [time, intervalId, play]);

  // Effect hook to resume timer if it was active before page refresh
  useEffect(() => {
    if (isActive && time > 0) {
      const id = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime >= 0) {
            sessionStorage.setItem(`pomodoroTime_${userId}`, newTime.toString());
            return newTime;
          } else {
            clearInterval(id);
            return 0;
          }
        });
      }, 1000);
      setIntervalId(id);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive]);

  // Function to format the remaining time into a readable format
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Function to calculate the color of the CircularProgress based on the remaining time
  const calculateColor = () => {
    const percentage = (time / (25 * 60)) * 100;
    if (percentage > 75) return '#00A4FF'; // Sea-Blue
    else if (percentage > 50) return '#20B2AA'; // Light Teal Green
    else if (percentage > 25) return '#FFC000'; // Gold
    else if (percentage > 10) return '#FFA500'; // Orange
    return '#FF4500'; // Red
  };

  // Render function for the PomodoroTimer component
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <IconButton onClick={toggle} color="primary">
        {isActive ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <Box position="relative" display="inline-flex" marginLeft="10px">
        <CircularProgress variant="determinate" value={(time / (25 * 60)) * 100} style={{ color: calculateColor() }} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{formatTime()}</Typography>
        </Box>
      </Box>
      <IconButton onClick={reset} color="secondary" style={{ marginLeft: '10px' }}>
        <RestartAltIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Time's up!"}</DialogTitle>
        <DialogContent>
          Your Pomodoro timer has finished. Time to take a short break or start another session!
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PomodoroTimer;
