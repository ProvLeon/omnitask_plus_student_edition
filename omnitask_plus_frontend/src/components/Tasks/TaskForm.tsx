import React, { useState } from 'react';
import { TextField, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl, Grid, SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTask, fileToBase64 } from '../apis/TaskApi'; // Updated import to use TaskApi

interface TaskData {
  title: string;
  description: string;
  start_date: Date | null; // Changed to Date type to match backend expectation
  end_date: Date | null; // Changed to Date type to match backend expectation
  priority: 'low' | 'medium' | 'high'; // Added priority to match backend expectation
  status: 'todo' | 'in progress' | 'completed'; // Added status to match backend expectation
  media: File | string | null; // Allow media to be File, string, or null
}

const TaskForm = () => {
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    start_date: null, // Adjusted to default to null to match backend expectation
    end_date: null, // Adjusted to default to null to match backend expectation
    priority: 'low', // Default priority
    status: 'todo', // Default status
    media: null, // Adjusted to default to null to match TaskApi
  });
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ name?: string | undefined; value: unknown; }> | SelectChangeEvent
  ) => {
    const name = 'name' in e.target ? e.target.name : undefined;
    const value = e.target.value;

    if (name === 'media') {
      const input = e.target as HTMLInputElement;
      if (input.files) {
        setTaskData({ ...taskData, [name]: input.files[0] });
      }
    } else if (name === 'start_date' || name === 'end_date') {
      setTaskData({ ...taskData, [name]: value ? new Date(value as string) : null });
    } else if (name) {
      setTaskData({ ...taskData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (taskData.media instanceof File) {
        const base64String = await fileToBase64(taskData.media); // Await the promise
        const newTaskData: TaskData = { ...taskData, media: base64String }; // Use the awaited string
        await createTask(newTaskData);
        navigate('/tasks');
      } else {
        // If no media or not a file, proceed without conversion
        await createTask(taskData); // Updated to use createTask from TaskApi
        navigate('/tasks');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Task
      </Typography>
      <TextField
        required
        id="title"
        name="title"
        label="Title"
        fullWidth
        variant="outlined"
        margin="normal"
        value={taskData.title}
        onChange={handleChange}
      />
      <TextField
        required
        id="description"
        name="description"
        label="Description"
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        margin="normal"
        value={taskData.description}
        onChange={handleChange}
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            id="start_date"
            name="start_date"
            label="Start Date"
            type="date"
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={taskData.start_date ? taskData.start_date.toISOString().split('T')[0] : ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="end_date"
            name="end_date"
            label="End Date"
            type="date"
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={taskData.end_date ? taskData.end_date.toISOString().split('T')[0] : ''}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              name="priority"
              value={taskData.priority}
              label="Priority"
              onChange={handleChange}
              required={true}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={taskData.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TextField
        id="media"
        name="media"
        label="Upload Media"
        type="file"
        fullWidth
        variant="outlined"
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleChange}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 2 }}
      >
        Create Task
      </Button>
    </Box>
  );
};

export default TaskForm;
