import React from 'react'
import TaskCard from '../components/TaskCard'
import data from '../Data.json'

interface BoardFrame {
  title: string;
  tasks: any[];
}

interface Task {
  title: string;
  description: string;
  priority: string;
  startDate: string;
  endDate: string;
  progress: number;
  personResponsible: {
    name: string;
    email: string;
    avatar: string;
  };
}

// Dynamically categorize tasks based on their progress
const categorizeTasks = () => {
  const categories: Record<string, Task[]> = {
    'To Do': [],
    'In Progress': [],
    'Done': [],
  };

  data.tasks.forEach((task: Task) => {
    if (task.progress === 0) {
      categories['To Do'].push(task);
    } else if (task.progress < 100) {
      categories['In Progress'].push(task);
    } else {
      categories['Done'].push(task);
    }
  });

  return [
    { id: 1, title: 'To Do', tasks: categories['To Do'] },
    { id: 2, title: 'In Progress', tasks: categories['In Progress'] },
    { id: 3, title: 'Done', tasks: categories['Done'] },
  ];
};

const boardFrames: BoardFrame[] = categorizeTasks();

const Boards = () => {
  return (
    <div className='grid grid-cols-3 gap-4  p-4'>
      {boardFrames.map((frame) => {
        return (
          <div className='flex flex-col gap-4 border border-dashed border-separate hover:border-double hover:shadow-lg rounded-md dark:border-gray-700 h-[fit-content] p-4' key={frame.title}>
            <h1 className='text-2xl font-bold text-center'>{frame.title}</h1>
            <hr/>
            <div className='flex flex-col gap-4'>
              {frame.tasks.map((task, index) => {
                return (
                  <TaskCard key={`${task.id}-${index}`}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    priority={task.priority}
                    startDate={new Date(task.startDate)}
                    endDate={new Date(task.endDate)}
                    personResponsible={task.personResponsible ? {image: task.personResponsible.avatar, name: task.personResponsible.name} : undefined}
                    progressCategory={task.progressCategory}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Boards

