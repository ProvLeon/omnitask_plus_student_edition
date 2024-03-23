import React, { useState, useEffect } from 'react'
import DropDown from './SmallComponents/DropDown';
import ProgressBar from './SmallComponents/ProgressBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Person {
  image: string;
  name: string;
}

interface TaskCardProps {
  id: string; // Added id for unique key
  title: string;
  description: string;
  priority: string;
  startDate: Date;
  endDate: Date;
  personResponsible?: Person;
  progressCategory: 'todo' | 'in progress' | 'done';
}

const TaskCard: React.FC<TaskCardProps> = ({ id, title, description, priority, startDate, endDate, personResponsible, progressCategory }) => {
  const [selectedPriority, setSelectedPriority] = useState(priority);
  const [selectedEndDate, setSelectedEndDate] = useState(endDate);
  const [selectedStartDate, setSelectedStartDate] = useState(startDate);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

  useEffect(() => {
    setSelectedPriority(priority);
  }, [priority]);

  const handlePriorityChange = (newPriority: string) => {
    setSelectedPriority(newPriority);
  }

  const handleStartDateChange = (date: Date) => {
    setSelectedStartDate(date);
    setIsStartDatePickerOpen(false); // Close the start date picker after selection
  }

  const handleEndDateChange = (date: Date) => {
    setSelectedEndDate(date);
    setIsEndDatePickerOpen(false); // Close the end date picker after selection
  }

  const toggleStartDatePicker = () => {
    setIsStartDatePickerOpen(!isStartDatePickerOpen);
  };

  const toggleEndDatePicker = () => {
    setIsEndDatePickerOpen(!isEndDatePickerOpen);
  };

  // Function to format date to "DD MMMM"
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  }

  const dateDetails: { date: Date, color: string, text: string, toggleDatePicker: () => void }[] = [
    { date: selectedStartDate, color: 'green', text: 'Start Date', toggleDatePicker: toggleStartDatePicker },
    { date: selectedEndDate, color: 'red', text: 'End Date', toggleDatePicker: toggleEndDatePicker },
  ]

  return (
    <div className='hover:shadow-lg hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-800 cursor-pointer shadow-md flex flex-col bg-white rounded-lg p-4 w-[300px] gap-2 relative' >
      <div id='vertical' className='absolute top-0 left-0 dark:bg-blue-900 bg-blue-500 w-1 h-full rounded-l-full'></div>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-bold'>{title}</h1>
        <div className='text-sm'>
          <DropDown options={['High', 'Medium', 'Low']} priority={selectedPriority} onChange={handlePriorityChange} />
        </div>
      </div>
      <ProgressBar startDate={selectedStartDate} endDate={selectedEndDate} progressCategory={progressCategory}/>
      {/* Description */}
      <div className='flex flex-col gap-1'>
        <h1 className='text-sm font-bold'>Description</h1>
        <p className='text-sm'>{description}</p>
      </div>
      {/* Date */}
      <div className='flex gap-1 justify-between items-center'>
          <div className='flex items-center gap-1 font-medium text-[12px]'>
        {personResponsible ? (
          <>
            <img src={personResponsible.image} alt={personResponsible.name} className='w-6 h-6 rounded-full' />
            {personResponsible.name}
          </>
            ) : (
            <>
            <div className='w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600'></div><p>Person Responsible</p>
            </>
            )}
          </div>
      </div>
          <div className='flex gap-1 justify-between'>
            { dateDetails.map((dateDetail) => (
            <div key={dateDetail.text} className='text-center border rounded hover:bg-gray-100 dark:hover:bg-gray-700'>
              <p className='text-[8px] font-normal text-gray-400'>{dateDetail.text}</p>
              <div className='flex  m-0  p-0 items-center text-[12px] font-normal text-gray-400 cursor-pointer' onClick={dateDetail.toggleDatePicker}><div className={`w-2 h-2 rounded-full ${dateDetail.color === 'green' ? 'bg-green-400' : 'bg-red-400'}`}></div>{formatDate(dateDetail.date)}</div>
              </div>))}
            </div>

        {isStartDatePickerOpen && (
          <div className="absolute top-full z-10" onBlur={() => setIsStartDatePickerOpen(false)}>
            <DatePicker
              selected={selectedStartDate}
              onChange={handleStartDateChange}
              inline
              maxDate={new Date()} // Disables dates after today for startDate
            />
          </div>
        )}
        {isEndDatePickerOpen && (
          <div className="absolute top-full z-10" onBlur={() => setIsEndDatePickerOpen(false)}>
            <DatePicker
              selected={selectedEndDate}
              onChange={handleEndDateChange}
              inline
            />
          </div>
        )}
    </div>
  )
}
export default TaskCard

