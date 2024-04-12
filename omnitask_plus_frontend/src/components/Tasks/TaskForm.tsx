import React, { useState, useEffect } from 'react';
import { Button, Typography, Input, Avatar, Tag, Space, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../apis/TaskApi'; // Updated import to use TaskApi
import { fileToBase64 } from '../../utils/utils';
import { getAllUsers } from '../apis/UserApi'; // Import the User API call
import { UploadOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons'; // Importing icons
import { Dialog, DialogTitle, DialogContent, FormControl, InputLabel, MenuItem, Select, Grid } from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';

export interface User {
  id: string;
  username: string;
  email: string;
  image: string;
}

interface TaskData {
  title: string;
  description: string;
  start_date: Date | null;
  end_date: Date | null;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in progress' | 'done';
  media: File | string | null;
  persons_responsible: User[]; // Adjusted for multiple persons responsible
}

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
`;

const TaskForm = () => {
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    start_date: null,
    end_date: null,
    priority: 'low',
    status: 'todo',
    media: null,
    persons_responsible: [], // Default to empty array
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };
    fetchUsers();
  }, []);

  const handleChange = (value: any, key: keyof TaskData) => {
    setTaskData({ ...taskData, [key]: value });
  };

  const handleDateChange = (value: Date | null, key: keyof TaskData) => {
    handleChange(value, key);
  };

  const handleUserSelect = (user: User) => {
    handleChange([...taskData.persons_responsible, user], 'persons_responsible');
  };

  const removeUser = (userId: string) => {
    handleChange(taskData.persons_responsible.filter(user => user.id !== userId), 'persons_responsible');
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (taskData.media instanceof File) {
        const base64String = await fileToBase64(taskData.media);
        const newTaskData: TaskData = { ...taskData, media: base64String };
        console.log(newTaskData)
        await createTask(newTaskData);
        navigate('/tasks');
      } else {
        await createTask(taskData);
        navigate('/tasks');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div onSubmit={handleSubmit}>
      <Typography.Title level={2} style={{ marginBottom: '24px' }}>Create New Task</Typography.Title>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Input
          placeholder="Title"
          prefix={<UserOutlined />}
          value={taskData.title}
          onChange={(e) => handleChange(e.target.value, 'title')}
          required
        />
        <Input.TextArea
          placeholder="Description"
          rows={4}
          value={taskData.description}
          onChange={(e) => handleChange(e.target.value, 'description')}
          required
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>

        <InputLabel className='w-32'>Start Date</InputLabel>
        <StyledDatePicker
          selected={taskData.start_date}
          onChange={(date: Date) => handleDateChange(date, 'start_date')}
          dateFormat="MMMM d, yyyy"
          showPopperArrow={false}
          popperPlacement="bottom-start"
          />
          </Grid>
        <Grid item xs={6}>
        <InputLabel>End Date</InputLabel>
        <StyledDatePicker
          selected={taskData.end_date}
          onChange={(date: Date) => handleDateChange(date, 'end_date')}
          dateFormat="MMMM d, yyyy"
          showPopperArrow={false}
          popperPlacement="bottom-start"
          />
          </Grid>
          </Grid>
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
        <Input
          type="file"
          prefix={<UploadOutlined />}
          onChange={(e) => handleChange(e.target.files ? e.target.files[0] : null, 'media')}
        />
        <Button type="primary" onClick={showModal} icon={<SearchOutlined />} style={{ width: '100%', marginTop: '16px' }}>
          Select Persons Responsible
        </Button>
        <div style={{ marginTop: '16px' }}>
          {taskData.persons_responsible.map(user => (
            <Tag key={user.id} closable onClose={() => removeUser(user.id)}>
              <Avatar src={user.image} icon={<UserOutlined />} />
              {user.username}
            </Tag>
          ))}
        </div>
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
        <Button onClick={handleSubmit} type="primary" htmlType="submit" style={{ width: '100%', marginTop: '16px' }}>
          Create Task
        </Button>
      </Space>
    </div>
  );
};

export default TaskForm;
