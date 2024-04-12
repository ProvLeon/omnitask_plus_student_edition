import  { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../components/apis/TaskApi'; // Importing task-related API functions
import TaskCard from '../components/TaskCard'; // Importing the TaskCard component
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Importing drag and drop components
import { Empty } from 'antd'; // Importing ant design Empty component for empty state UI

// Defining the structure of a board frame, which includes an id, title, and an array of tasks
interface BoardFrame {
  id: string;
  title: string;
  tasks: Task[];
}

// Defining the structure of a task with various properties including id, title, description, priority, dates, status, and responsible persons
interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  start_date: Date; // Ensure this matches the backend format "%Y-%m-%dT%H:%M:%S.%fZ"
  end_date: Date; // Ensure this matches the backend format "%Y-%m-%dT%H:%M:%S.%fZ"
  status: "todo" | "in progress" | "done";
  persons_responsible: []
}

// Main functional component for the Boards page
const Boards = () => {
  const [boardFrames, setBoardFrames] = useState<BoardFrame[]>([]); // State to hold the board frames

  // Fetch tasks from the API and categorize them into board frames on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getTasks(); // Fetching tasks
      categorizeTasks(tasks); // Categorizing tasks into frames
      console.log(tasks); // Logging tasks for debugging
    };
    fetchTasks();
  }, []);

  // Function to categorize tasks into 'To Do', 'In Progress', and 'Done' categories
  const categorizeTasks = (tasks: Task[]) => {
    const categories: Record<string, Task[]> = {
      'To Do': [],
      'In Progress': [],
      'Done': [],
    };

    // Sorting tasks into their respective categories based on their status
    tasks.forEach((task: Task) => {
      if (task.status === 'todo') {
        categories['To Do'].push(task);
      } else if (task.status === 'in progress') {
        categories['In Progress'].push(task);
      } else {
        categories['Done'].push(task);
      }
    });

    // Creating board frames from the categorized tasks
    const frames: BoardFrame[] = [
      { id: 'todo', title: 'To Do', tasks: categories['To Do'] },
      { id: 'in-progress', title: 'In Progress', tasks: categories['In Progress'] },
      { id: 'done', title: 'Done', tasks: categories['Done'] },
    ];

    setBoardFrames(frames); // Updating the state with the new board frames
  };

  // Function to map a task's status to its corresponding category
  const getStatusCategory = (status: string): "todo" | "in progress" | "done" => {
    if (status === 'todo') return "todo";
    if (status === 'in progress') return "in progress";
    return "done";
  };

  // Handler for when a task is dragged and dropped
  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    // Do nothing if the task is dropped outside a droppable area or dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const start = boardFrames.find(frame => frame.id === source.droppableId); // Finding the start frame
    const finish = boardFrames.find(frame => frame.id === destination.droppableId); // Finding the destination frame

    // Do nothing if the task is moved within the same frame
    if (start === finish) {
      return;
    }

    // Find the task that was moved
    const task = start?.tasks.find(task => task.id === draggableId);

    if (task) {
      // Determine the new status based on the destination frame
      let updatedStatus = 'todo'; // Default to 'To Do'
      if (destination.droppableId === 'in-progress') {
        updatedStatus = 'in progress'; // Arbitrary value representing 'In Progress'
      } else if (destination.droppableId === 'done') {
        updatedStatus = 'done'; // Represents 'Done'
      }

      try {
        await updateTaskStatus(task.id, updatedStatus); // Updating the task's status in the database
        const tasks = await getTasks(); // Fetching updated tasks
        categorizeTasks(tasks); // Recategorizing tasks
      } catch (error) {
        console.error('Failed to update task status:', error); // Logging error
      }
    }
  };

  // Rendering the board frames and tasks using drag and drop context
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="text-center mb-6 mt-3">
          <h2 className="text-3xl font-bold mb-2">Task Management Board</h2>
          <p className="text-lg">Drag & Drop tasks across different stages</p>
        </div>
      <div className='grid grid-cols-3 gap-4 p-4 md:w-[100vw] '>
        {boardFrames.map((frame) => (
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
                              personsResponsible={task.persons_responsible}
                              progressCategory={getStatusCategory(task.status)}
                              />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <Empty description="No tasks created yet" /> // Displaying an empty state if there are no tasks
                    )}
                  {provided.placeholder}
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
