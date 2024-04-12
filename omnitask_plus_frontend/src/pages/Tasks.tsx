// Importing TaskUI component from the Tasks folder within components
import TaskUI from '../components/Tasks/TaskUI'

// Tasks functional component definition
const Tasks = () => {
  // Rendering the Tasks page layout
  return (
    // Container div for tasks with flex display and gap for styling
    <div id='tasks' className='flex gap-2'>
      {/* TaskUI component is rendered here to display individual tasks */}
      <TaskUI/>
    </div>
  )
}

// Exporting Tasks component for use in other parts of the application
export default Tasks
