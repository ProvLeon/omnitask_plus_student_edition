import React from 'react'

interface ProgressBarProps {
  startDate: Date;
  endDate: Date;
  currentDate?: Date; // Made currentDate optional
  progressCategory: 'todo' | 'in progress' | 'done';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ startDate, endDate, currentDate = new Date(), progressCategory }) => {
  const calculateProgress = () => {
    const totalDurationDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    const daysUntilEnd = (new Date(endDate).getTime() - new Date(currentDate).getTime()) / (1000 * 3600 * 24);

    if (totalDurationDays >= 100) {
      if (daysUntilEnd < 5 && daysUntilEnd > 1) {
        return 90;
      } else if (daysUntilEnd <= 1) {
        return 100;
      }
    }
    else if (new Date(endDate).getTime().toPrecision(4) == new Date(currentDate).getTime().toPrecision(4)) {
      return 100;
    }
    const now = new Date(currentDate).getTime();
    // Ensure current time is within the start and end dates
    const adjustedNow = Math.min(Math.max(now, new Date(startDate).getTime()), new Date(endDate).getTime());
    const currentDuration = adjustedNow - new Date(startDate).getTime();
    const progressPercentage = (currentDuration / (totalDurationDays * 1000 * 3600 * 24)) * 100;
    return Math.min(Math.max(progressPercentage, 0), 100); // Ensures progress is between 0 and 100

  };

  const progress = calculateProgress();
  const progressText = `${progress.toPrecision(3)}%`;

  // Update progress bar color based on progress and progress category
  let progressBarColor = 'bg-gray-200'; // Default color
  if (progressCategory !== 'done') {
    if (progress < 30) {
      progressBarColor = 'bg-gray-200'; // Default color
    } else if (progress < 50) {
      progressBarColor = 'bg-green-500';
    } else if (progress < 75) {
      progressBarColor = 'bg-yellow-500';
    } else if (progress < 100) {
      progressBarColor = 'bg-orange-500';
    } else {
      progressBarColor = 'bg-red-500';
    }
  }
  let progressTextDone = '';
  if (progressCategory === 'done') {
    progressBarColor = 'bg-green-400';
    progressTextDone = 'Done';
  }

  return (
    <div className={`w-full ${progressBarColor} flex items-center text-center rounded-full h-1.5 dark:bg-gray-700 relative`}>
      <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
      <p className={`absolute w-full text-center justify-center self-center text-[8px] text-gray-800`} style={{ left: '50%', transform: 'translateX(-50%)' }}>{progressCategory == 'done' ? progressTextDone : progressText}</p>
    </div>
  )
}

export default ProgressBar
