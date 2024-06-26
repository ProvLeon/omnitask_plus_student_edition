import React, { useState, useEffect, useRef, useCallback } from 'react'
import DropDown from './SmallComponents/DropDown'; // Importing custom DropDown component
import ProgressBar from './SmallComponents/ProgressBar'; // Importing custom ProgressBar component
import DatePicker from 'react-datepicker'; // Importing DatePicker component for date selection
import 'react-datepicker/dist/react-datepicker.css'; // Importing DatePicker styles
import { CalendarOutlined } from '@ant-design/icons'; // Importing Calendar icon from Ant Design
import { Button, Card, Avatar, Tooltip, Typography, Modal, Input, List, Tag } from 'antd'; // Importing various components from Ant Design for UI
import { updateTaskAttribute } from './apis/TaskApi'; // Importing API call to update task attributes
import { getAllUsers, getUserData } from './apis/UserApi'; // Importing User API calls

// Defining Person interface for type safety
interface Person {
  id: string;
  image: string;
  username: string;
  email: string;
}

// Defining TaskCardProps interface for type safety
interface TaskCardProps {
  id: string; // Unique identifier for each task
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  startDate: Date;
  endDate: Date;
  personsResponsible?: Person[]; // Optional array of persons responsible for the task
  progressCategory: 'todo' | 'in progress' | 'done';
}

// TaskCard functional component
const TaskCard: React.FC<TaskCardProps> = ({ id, title, description, priority, startDate, endDate, personsResponsible, progressCategory }) => {
  // State hooks for various component states
  const [selectedPriority, setSelectedPriority] = useState(priority);
  const [selectedEndDate, setSelectedEndDate] = useState(endDate);
  const [selectedStartDate, setSelectedStartDate] = useState(startDate);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const startDatePickerRef = useRef<HTMLDivElement>(null);
  const endDatePickerRef = useRef<HTMLDivElement>(null);
  const [isUserSearchModalVisible, setIsUserSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [allUsers, setAllUsers] = useState<Person[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Person[]>([]);

  // Effect hook to log selected users
  useEffect(() => {
    console.log(selectedUsers)
  }, [selectedUsers]);

  // Effect hook to handle clicks outside the date picker to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target as Node)) {
        setIsStartDatePickerOpen(false);
      }
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target as Node)) {
        setIsEndDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Effect hook to fetch all users and set selected users if any
  useEffect(() => {
    const fetchAllUsers = async () => {
      const users = await getAllUsers();
      setAllUsers(users.map((user: any) => ({ id: user.id, username: user.username, image: user.image, email: user.email })));

      if (personsResponsible) {
        const personsData = await Promise.all(personsResponsible.map((user:any) => getUserData(user)));
        setSelectedUsers(personsData); // Directly use the fetched data
      }
    };
    fetchAllUsers();
  }, []);

  // Function to handle priority change
  const handlePriorityChange = async (newPriority: string) => {
    const priority: "high" | "medium" | "low" = newPriority as "high" | "medium" | "low";
    setSelectedPriority(priority);
    await updateTaskAttribute(id, 'priority', priority.toLowerCase()); // Update priority in the backend
  };

  // Function to handle start date change
  const handleStartDateChange = async (date: Date | null) => {
    if (date) {
      setSelectedStartDate(date);
      await updateTaskAttribute(id, 'start_date', date.toISOString()); // Update start_date in the backend
    }
  };

  // Function to handle end date change
  const handleEndDateChange = async (date: Date | null) => {
    if (date) {
      setSelectedEndDate(date);
      await updateTaskAttribute(id, 'end_date', date.toISOString()); // Update end_date in the backend
    }
  };

  // Function to toggle start date picker visibility
  const toggleStartDatePicker = () => {
    setIsStartDatePickerOpen(!isStartDatePickerOpen);
  };

  // Function to toggle end date picker visibility
  const toggleEndDatePicker = () => {
    setIsEndDatePickerOpen(!isEndDatePickerOpen);
  };

  // Function to format date to "DD MMMM"
  const formatDate = (date: Date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      // If the date is invalid, return a placeholder or an error message
      return "Invalid Date";
    }
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    return parsedDate.toLocaleDateString('en-US', options);
  }

  // Array to hold date details for rendering
  const dateDetails: { date: Date, color: string, text: string, toggleDatePicker: () => void }[] = [
    { date: selectedStartDate, color: 'green', text: 'Start Date', toggleDatePicker: toggleStartDatePicker },
    { date: selectedEndDate, color: 'red', text: 'End Date', toggleDatePicker: toggleEndDatePicker },
  ]

  // Function to handle user search
  const handleSearchForUser = useCallback(async (query: string) => {
    setSearchQuery(query); // Update search query state
    if (query.length > 2) { // Only search if the query length is more than 2 characters
      const filteredUsers = allUsers.filter(user =>
        (user.username?.toLowerCase().includes(query.toLowerCase()) ||
        user.email?.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]); // Clear results if query is too short
    }
  }, [allUsers]);

  // Effect hook to debounce user search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        handleSearchForUser(searchQuery);
      } else {
        setSearchResults(allUsers); // Display all users if no search query
      }
    }, 300); // Delay search to reduce number of requests

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, handleSearchForUser, allUsers]);

  // Function to handle tag click for user selection
  const handleTagClick = (user: Person) => {
    if (selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Function to handle modal OK action
  const handleModalOk = async () => {
    await updateTaskAttribute(id, 'persons_responsible', selectedUsers.map(user => user.id)); // Update persons_responsible in the backend
    setIsUserSearchModalVisible(false); // Close the modal after selection
  };

  // Function to toggle user search modal visibility
  const toggleUserSearchModal = () => {
    setIsUserSearchModalVisible(!isUserSearchModalVisible);
  };

  // Rendering TaskCard component
  return (
    <div className='hover:shadow-xl hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer shadow-md flex flex-col bg-white rounded-lg p-4 w-full md:w-[300px] gap-2 relative transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-95' >
      <div id='vertical' className='absolute top-0 left-0 dark:bg-blue-900 bg-blue-500 w-1 h-full rounded-l-full'></div>
      <div className='flex justify-between items-center'>
        <Typography.Title level={2} className='text-xl font-bold'>{title}</Typography.Title>
        <div className='text-sm'>
          <DropDown options={['High', 'Medium', 'Low']} priority={selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1).toLowerCase()} onChange={handlePriorityChange} />
        </div>
      </div>
        <hr className='w-full h-0.5 bg-gray-200 dark:bg-gray-600'/>
      <ProgressBar startDate={selectedStartDate} endDate={selectedEndDate} progressCategory={progressCategory}/>
      {/* Description */}
      <Card className='mt-2' bordered={true} style={{ borderColor: '#1890ff' }}>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Description</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>{description}</p>
      </Card>

      {/* Date */}
      <div className='flex gap-1 justify-between mt-2'>
        {dateDetails.map((dateDetail) => (
          <div key={dateDetail.text} className='text-center border rounded hover:bg-gray-100 dark:hover:bg-gray-700'>
            <p className='text-[8px] font-normal text-gray-400'>{dateDetail.text}</p>
            <Button type="text" onClick={dateDetail.toggleDatePicker} icon={<CalendarOutlined />} className='flex items-center text-[12px] font-normal text-gray-400 cursor-pointer'>{formatDate(new Date(dateDetail.date))}</Button>
          </div>
        ))}
      </div>

      {/* Date Pickers */}
      {isStartDatePickerOpen && (
        <div className="absolute top-full z-10" ref={startDatePickerRef}>
          <DatePicker
            selected={new Date(selectedStartDate)}
            onChange={handleStartDateChange}
            inline
            customInput={<Button icon={<CalendarOutlined />} />}
            maxDate={new Date()} // Disables dates after today for startDate
          />
        </div>
      )}
      {isEndDatePickerOpen && (
        <div className="absolute top-full z-10" ref={endDatePickerRef}>
          <DatePicker
            selected={new Date(selectedEndDate)}
            onChange={handleEndDateChange}
            inline
            customInput={<Button icon={<CalendarOutlined />} />}
            minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
          />
        </div>
      )}
      <div className='mt-2'>
      </div>
      {/* User Search Modal */}
      <Modal title="Search for a User" open={isUserSearchModalVisible} onOk={handleModalOk} onCancel={toggleUserSearchModal} footer={null} className="user-search-modal">
        <Input.Search placeholder="Enter username or email" enterButton onSearch={(value) => handleSearchForUser(value)} onChange={(e) => setSearchQuery(e.target.value)} className="user-search-input" />
        <List
          itemLayout="horizontal"
          dataSource={searchResults}
          renderItem={item => (
            <List.Item key={item.id}>
              <Tag
                color={selectedUsers.some(user => user.id === item.id) ? 'blue' : 'default'}
                onClick={() => handleTagClick(item)}
                className="cursor-pointer w-auto rounded-lg"
              >
                <div className='flex items-center gap-2 p-2'>
                  <Avatar src={item.image} />
                  <div>{item.username}</div>
                  <Tag color="blue">{item.email}</Tag>
                </div>
              </Tag>
            </List.Item>
          )}
        />
        <Button type="primary" onClick={handleModalOk} className="user-search-ok-btn">OK</Button>
      </Modal>
       {/* Person Responsible */}
       <div className='flex justify-between items-center mt-2' onClick={toggleUserSearchModal}>
        <Typography.Text strong>Person Responsible:</Typography.Text>
        <div className='flex items-center gap-2'>
          {selectedUsers.length > 0 ? (
            selectedUsers.map(person => (
              <Tooltip key={person.id} title={`${person.username} (${person.email})`}>
                <Avatar src={person.image} />
              </Tooltip>
            ))
          ) : (
            <span>Unassigned</span>
          )}
        </div>
      </div>
    </div>
  )
}
export default TaskCard
