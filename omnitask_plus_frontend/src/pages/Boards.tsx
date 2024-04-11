import React, { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../components/apis/TaskApi'; // Updated import to use updateTaskStatus
import TaskCard from '../components/TaskCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Empty } from 'antd'; // Importing ant design Empty component

interface BoardFrame {
  id: string;
  title: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  start_date: Date; // Ensure this matches the backend format "%Y-%m-%dT%H:%M:%S.%fZ"
  end_date: Date; // Ensure this matches the backend format "%Y-%m-%dT%H:%M:%S.%fZ"
  status: "todo" | "in progress" | "done";
  personResponsible: {
    id: string;
    image: string;
    email: string;
    username: string;
  };
}

const Boards = () => {
  const [boardFrames, setBoardFrames] = useState<BoardFrame[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getTasks();
      categorizeTasks(tasks);
    };
    fetchTasks();
  }, []);

  const categorizeTasks = (tasks: Task[]) => {
    const categories: Record<string, Task[]> = {
      'To Do': [],
      'In Progress': [],
      'Done': [],
    };

    tasks.forEach((task: Task) => {
      if (task.status === 'todo') {
        categories['To Do'].push(task);
      } else if (task.status === 'in progress') {
        categories['In Progress'].push(task);
      } else {
        categories['Done'].push(task);
      }
    });

    const frames: BoardFrame[] = [
      { id: 'todo', title: 'To Do', tasks: categories['To Do'] },
      { id: 'in-progress', title: 'In Progress', tasks: categories['In Progress'] },
      { id: 'done', title: 'Done', tasks: categories['Done'] },
    ];

    setBoardFrames(frames);
  };

  const getStatusCategory = (status: string): "todo" | "in progress" | "done" => {
    if (status === 'todo') return "todo";
    if (status === 'in progress') return "in progress";
    return "done";
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = boardFrames.find(frame => frame.id === source.droppableId);
    const finish = boardFrames.find(frame => frame.id === destination.droppableId);

    if (start === finish) {
      // If the task is moved within the same frame, no need to update the database
      return;
    }

    // Find the task that was moved
    const task = start?.tasks.find(task => task.id === draggableId);

    if (task) {
      // Update the task's progress based on the destination frame
      let updatedStatus = 'todo'; // Default to 'To Do'
      if (destination.droppableId === 'in-progress') {
        updatedStatus = 'in progress'; // Arbitrary value representing 'In Progress'
      } else if (destination.droppableId === 'done') {
        updatedStatus = 'done'; // Represents 'Done'
      }

      try {
        await updateTaskStatus(task.id, updatedStatus);
        // Fetch tasks again to refresh the UI
        const tasks = await getTasks();
        categorizeTasks(tasks);
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
  };

  return (

    <DragDropContext onDragEnd={onDragEnd}>
      <div className="text-center mb-6 mt-3">
          <h2 className="text-3xl font-bold mb-2">Task Management Board</h2>
          <p className="text-lg">Drag & Drop tasks across different stages</p>
        </div>
      <div className='grid grid-cols-3 gap-4 p-4 md:w-[100vw] '>
        {boardFrames.map((frame, index) => (
          <Droppable droppableId={frame.id} key={frame.id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='flex flex-col gap-4 border border-dashed border-separate hover:border-double hover:shadow-lg rounded-md dark:border-gray-700 h-[fit-content] p-4'
              >
                <h1 className='text-2xl font-bold text-center'>{frame.title}</h1>
                <hr />
                <div className='flex flex-col gap-4 items-center'>
                  {frame.tasks.length > 0 ? (
                    frame.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              id={task.id}
                              title={task.title}
                              description={task.description}
                              priority={task.priority}
                              startDate={task.start_date}
                              endDate={task.end_date}
                              personsResponsible={task.personResponsible ? [{
                                id: task.personResponsible.id,
                                image: task.personResponsible.image,
                                email: task.personResponsible.email,
                                username: task.personResponsible.username
                              }] : undefined}
                              progressCategory={getStatusCategory(task.status)}
                              />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <Empty description="No tasks created yet" />
                    )}
                  {provided.placeholder}
                    {/* {index === boardFrames.length - 1 && frame.tasks.length === 0 && (

                    )} */}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Boards
