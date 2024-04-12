// Interface defining the props for ProgressBar component
interface ProgressBarProps {
  startDate: Date; // The start date of the task
  endDate: Date; // The end date of the task
  currentDate?: Date; // The current date, optional and defaults to today
  progressCategory: 'todo' | 'in progress' | 'done'; // Category of task progress
}

// ProgressBar component definition
const ProgressBar: React.FC<ProgressBarProps> = ({ startDate, endDate, currentDate = new Date(), progressCategory }) => {

  // Function to calculate the progress percentage
  const calculateProgress = () => {
    // Calculate total duration in days
    const totalDurationDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    // Calculate days until the end date from the current date
    const daysUntilEnd = (new Date(endDate).getTime() - new Date(currentDate).getTime()) / (1000 * 3600 * 24);

    // Special conditions for progress calculation
    if (totalDurationDays >= 100) {
      if (daysUntilEnd < 5 && daysUntilEnd > 1) {
        return 90; // Near completion for long tasks
      } else if (daysUntilEnd <= 1) {
        return 100; // Task is completed or overdue
      }
    }
    else if (new Date(endDate).getTime().toPrecision(4) == new Date(currentDate).getTime().toPrecision(4)) {
      return 100; // Exact match of end date and current date
    }
    const now = new Date(currentDate).getTime();
    // Adjust current time to be within the start and end dates
    const adjustedNow = Math.min(Math.max(now, new Date(startDate).getTime()), new Date(endDate).getTime());
    // Calculate current duration from the start date
    const currentDuration = adjustedNow - new Date(startDate).getTime();
    // Calculate progress percentage
    const progressPercentage = (currentDuration / (totalDurationDays * 1000 * 3600 * 24)) * 100;
    // Ensure progress is between 0 and 100
    return Math.min(Math.max(progressPercentage, 0), 100);
  };

  // Calculate progress using the above function
  const progress = calculateProgress();
  // Format progress text to display
  const progressText = `${progress.toPrecision(3)}%`;

  // Determine progress bar color based on progress and category
  let progressBarColor = 'bg-gray-200'; // Default color
  if (progressCategory !== 'done') {
    if (progress < 30) {
      progressBarColor = 'bg-gray-200'; // Low progress color
    } else if (progress < 50) {
      progressBarColor = 'bg-green-500'; // Moderate progress color
    } else if (progress < 75) {
      progressBarColor = 'bg-yellow-500'; // High progress color
    } else if (progress < 100) {
      progressBarColor = 'bg-orange-500'; // Near completion color
    } else {
      progressBarColor = 'bg-red-500'; // Overdue color
    }
  }
  if (progressCategory === 'done' && progress < 100) {
    progressBarColor = 'bg-red-400'; // Special color for 'done' but not 100% progress
  }

  // Render the progress bar with dynamic styles and text
  return (
    <div className={`w-full ${progressBarColor} flex items-center text-center rounded-full h-1.5 dark:bg-gray-700 relative`}>
      <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
      <p className={`absolute w-full text-center justify-center self-center text-[8px] text-gray-800`} style={{ left: '50%', transform: 'translateX(-50%)' }}>{ progressText}</p>
    </div>
  )
}

export default ProgressBar
