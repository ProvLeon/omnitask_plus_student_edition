import React from 'react';
// Importing necessary components from MUI for UI design
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Selector component to display and manage task priority
export default function Selector({ priority: initialPriority }: { title: string, description: string, priority: string, progress: number, date: Date }) {
  // State to manage the priority of a task
  const [priority, setPriority] = React.useState<string>(initialPriority);

  // Component to render priority icons based on the level of priority
  const PriorityIcon = ({ level }: { level: string }) => {
    let icons = [];
    // Switch case to determine the number of icons based on priority level
    switch (level) {
      case 'High':
        icons = [<ArrowForwardIosIcon />, <ArrowForwardIosIcon />, <ArrowForwardIosIcon />];
        break;
      case 'Medium':
        icons = [<ArrowForwardIosIcon />, <ArrowForwardIosIcon />];
        break;
      case 'Low':
        icons = [<ArrowForwardIosIcon />];
        break;
      default:
        icons = [<ArrowForwardIosIcon />]; // Default to low or none
    }
    // Returning the icons as fragments to ensure unique keys and prevent React key warning
    return <>{icons.map((icon, index) => <React.Fragment key={index}>{icon}</React.Fragment>)}</>;
  };

  // Render the card component with action buttons to set task priority
  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* Placeholder for other card content */}
      <CardActions disableSpacing>
        {/* Buttons to set the priority of a task */}
        <IconButton aria-label="Low priority" onClick={() => setPriority('Low')}>
          <PriorityIcon level="Low" />
        </IconButton>
        <IconButton aria-label="Medium priority" onClick={() => setPriority('Medium')}>
          <PriorityIcon level="Medium" />
        </IconButton>
        <IconButton aria-label="High priority" onClick={() => setPriority('High')}>
          <PriorityIcon level="High" />
        </IconButton>
      </CardActions>
    </Card>
  );
}
