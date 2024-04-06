import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import useSound from 'use-sound';
import peepSound from '../../sounds/alarm_peep.wav'; // Assuming the sound file is located in the sounds folder

const PomodoroTimer = ({className}: {className?: string}) => {
  const [open, setOpen] = useState(false);
  const userId = sessionStorage.getItem('userId'); // Assuming there's a userId stored in localStorage
  // Retrieve the remaining time and active state from localStorage or set defaults
  const [time, setTime] = useState(() => {
    const savedTime = sessionStorage.getItem(`pomodoroTime_${userId}`);
    return savedTime ? parseInt(savedTime, 10) : 25 * 60; // Default Pomodoro time 25 minutes
  });
  const [isActive, setIsActive] = useState(() => {
    const savedIsActive = sessionStorage.getItem(`pomodoroIsActive_${userId}`);
    return savedIsActive ? savedIsActive === 'true' : false;
  });
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [play] = useSound(peepSound, { interrupt: true });

  useEffect(() => {
    // Removed the condition to play sound here as it's handled in the useEffect for time === 0
  }, [time]);

  const toggle = () => {
    setIsActive(!isActive);
    sessionStorage.setItem(`pomodoroIsActive_${userId}`, (!isActive).toString());
    if (!isActive && time > 0) { // Check if time is greater than 0 before starting the timer
      const id = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime >= 0) { // Ensure time does not go below 0
            sessionStorage.setItem(`pomodoroTime_${userId}`, newTime.toString());
            return newTime;
          } else {
            clearInterval(id); // Stop the timer if time reaches 0
            return 0; // Ensure time is set to 0
          }
        });
      }, 1000);
      setIntervalId(id);
    } else {
      if (intervalId) clearInterval(intervalId);
    }
  };

  const reset = () => {
    setTime(25 * 60);
    sessionStorage.setItem(`pomodoroTime_${userId}`, (25 * 60).toString());
    setIsActive(false);
    sessionStorage.setItem(`pomodoroIsActive_${userId}`, 'false');
    if (intervalId) clearInterval(intervalId);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (time === 0) {
      setIsActive(false);
      sessionStorage.setItem(`pomodoroIsActive_${userId}`, 'false');
      setOpen(true);
      if (intervalId) clearInterval(intervalId);
      play();
      // Removed the reset call here to stop the timer at 0 until the user decides to start again
    }
  }, [time, intervalId, play]);

  useEffect(() => {
    // Resume timer if it was active before page was refreshed
    if (isActive && time > 0) { // Check if time is greater than 0 before resuming the timer
      const id = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime >= 0) { // Ensure time does not go below 0
            sessionStorage.setItem(`pomodoroTime_${userId}`, newTime.toString());
            return newTime;
          } else {
            clearInterval(id); // Stop the timer if time reaches 0
            return 0; // Ensure time is set to 0
          }
        });
      }, 1000);
      setIntervalId(id);
    }
    // Cleanup interval on component unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive]);

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const calculateColor = () => {
    const percentage = (time / (25 * 60)) * 100;
    if (percentage > 75) return '#00A4FF'; // Sea-Blue
    else if (percentage > 50) return '#20B2AA'; // Light Teal Green
    else if (percentage > 25) return '#FFC000'; // Gold
    else if (percentage > 10) return '#FFA500'; // Orange
    return '#FF4500'; // Red
  };

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
