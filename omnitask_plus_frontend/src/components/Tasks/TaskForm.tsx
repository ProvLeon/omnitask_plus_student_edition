import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../apis/TaskApi'; // Updated import to use TaskApi

interface TaskData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  media: string | File; // Allow media to be either string or File
}

const TaskForm = () => {
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    media: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'media' && files) {
      setTaskData({ ...taskData, [name]: files[0] });
    } else {
      setTaskData({ ...taskData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(taskData).forEach((key) => {
        if (key === 'media' && taskData.media) {
          formData.append(key, taskData.media);
        } else if (taskData[key as keyof typeof taskData] !== '') {
          formData.append(key, taskData[key as keyof typeof taskData]);
        }
      });
      await createTask(formData); // Updated to use createTask from TaskApi
      navigate('/tasks');
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
        value={taskData.start_date}
        onChange={handleChange}
      />
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
        value={taskData.end_date}
        onChange={handleChange}
      />
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
