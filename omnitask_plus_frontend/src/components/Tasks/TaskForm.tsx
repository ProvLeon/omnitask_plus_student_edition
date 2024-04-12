import React, { useState, useEffect } from 'react';
import { Button, Typography, Input, Avatar, Tag, Space, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../apis/TaskApi'; // Import for creating a task
import { fileToBase64 } from '../../utils/utils'; // Utility for converting files to Base64
import { getAllUsers } from '../apis/UserApi'; // Import to fetch all users
import { UploadOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons'; // Importing necessary icons
import { Dialog, DialogTitle, DialogContent, FormControl, InputLabel, MenuItem, Select, Grid } from '@mui/material';
import DatePicker from "react-datepicker"; // Date picker component
import "react-datepicker/dist/react-datepicker.css"; // Date picker styling
import styled from 'styled-components';
import { format } from 'date-fns'; // Import for formatting dates

// Interface for User data structure
export interface User {
  id: string;
  username: string;
  email: string;
  image: string;
}

// Interface for Task data structure
interface TaskData {
  title: string;
  description: string;
  start_date: Date | string | number;
  end_date: Date | string | number;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in progress' | 'done';
  media: File | string | null;
  persons_responsible: User[]; // Array to hold multiple users responsible for the task
}

// Styled component for the DatePicker
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
`;

// Main TaskForm component
const TaskForm = () => {
  // State for task data
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(),
    priority: 'low',
    status: 'todo',
    media: null,
    persons_responsible: [], // Initialize with empty array
  });
  // State for users list
  const [users, setUsers] = useState<User[]>([]);
  // State for modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Hook for navigation
  const navigate = useNavigate();

  // Effect to fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };
    fetchUsers();
  }, []);

  // Function to handle changes in form fields
  const handleChange = (value: any, key: keyof TaskData) => {
    setTaskData({ ...taskData, [key]: value });
  };

  // Function to handle date changes
  const handleDateChange = (value: Date | null, key: keyof TaskData) => {
    if (value) {
      handleChange(format(value, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"), key);
    }
  };

  // Function to handle user selection for persons responsible
  const handleUserSelect = (user: User) => {
    handleChange([...taskData.persons_responsible, user], 'persons_responsible');
  };

  // Function to remove a user from persons responsible
  const removeUser = (userId: string) => {
    handleChange(taskData.persons_responsible.filter(user => user.id !== userId), 'persons_responsible');
  };

  // Function to show modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let payload = { ...taskData };
      if (payload.media instanceof File) {
        const base64String = await fileToBase64(payload.media);
        payload = { ...payload, media: base64String };
      }
      await createTask(payload);
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Render function for the component
  return (
    <div onSubmit={handleSubmit}>
      <Typography.Title level={2} style={{ marginBottom: '24px' }}>Create New Task</Typography.Title>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Task title input */}
        <Input
          placeholder="Title"
          prefix={<UserOutlined />}
          value={taskData.title}
          onChange={(e) => handleChange(e.target.value, 'title')}
          required
        />
        {/* Task description input */}
        <Input.TextArea
          placeholder="Description"
          rows={4}
          value={taskData.description}
          onChange={(e) => handleChange(e.target.value, 'description')}
          required
        />
        {/* Date pickers for start and end dates */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InputLabel className='w-32'>Start Date</InputLabel>
            <StyledDatePicker
              selected={new Date(taskData.start_date)}
              onChange={(date: Date) => handleDateChange(date, 'start_date')}
              dateFormat="MMMM d, yyyy"
              showPopperArrow={false}
              popperPlacement="bottom-start"
              />
          </Grid>
          <Grid item xs={6}>
            <InputLabel>End Date</InputLabel>
            <StyledDatePicker
              selected={new Date(taskData.end_date)}
              onChange={(date: Date) => handleDateChange(date, 'end_date')}
              dateFormat="MMMM d, yyyy"
              showPopperArrow={false}
              popperPlacement="bottom-start"
              />
          </Grid>
        </Grid>
        {/* Priority and status selectors */}
        <div className='flex items-center justify-between gap-4'>
          <FormControl fullWidth >
            <InputLabel>Priority</InputLabel>
            <Select
              value={taskData.priority}
              onChange={(e) => handleChange(e.target.value, 'priority')}
              label="Priority"
              >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={taskData.status}
              onChange={(e) => handleChange(e.target.value, 'status')}
              label="Status"
            >
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* File input for task media */}
        <Input
          type="file"
          prefix={<UploadOutlined />}
          onChange={(e) => handleChange(e.target.files ? e.target.files[0] : null, 'media')}
        />
        {/* Button to show modal for selecting persons responsible */}
        <Button type="primary" onClick={showModal} icon={<SearchOutlined />} style={{ width: '100%', marginTop: '16px' }}>
          Select Persons Responsible
        </Button>
        {/* Display selected persons responsible */}
        <div style={{ marginTop: '16px' }}>
          {taskData.persons_responsible.map(user => (
            <Tag key={user.id} closable onClose={() => removeUser(user.id)}>
              <Avatar src={user.image} icon={<UserOutlined />} />
              {user.username}
            </Tag>
          ))}
        </div>
        {/* Modal for selecting persons responsible */}
        <Dialog open={isModalVisible} onClose={() => setIsModalVisible(false)} style={{ width: '100%' }}>
          <DialogTitle>Select Persons Responsible</DialogTitle>
          <DialogContent>
            <List
              itemLayout="horizontal"
              dataSource={users}
              renderItem={user => (
                <List.Item key={user.id} onClick={() => handleUserSelect(user)}>
                  <List.Item.Meta
                    avatar={<Avatar src={user.image} icon={<UserOutlined />} />}
                    title={user.username}
                    description={user.email}
                  />
                </List.Item>
              )}
            />
          </DialogContent>
        </Dialog>
        {/* Submit button for the form */}
        <Button onClick={handleSubmit} type="primary" htmlType="submit" style={{ width: '100%', marginTop: '16px' }}>
          Create Task
        </Button>
      </Space>
    </div>
  );
};

export default TaskForm;
