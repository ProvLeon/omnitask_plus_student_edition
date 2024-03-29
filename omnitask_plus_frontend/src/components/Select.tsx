import React from 'react';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Selector({ priority: initialPriority }: { title: string, description: string, priority: string, progress: number, date: Date }) {
  const [priority, setPriority] = React.useState<string>(initialPriority);

  priority

    const PriorityIcon = ({ level }: { level: string }) => {
    let icons = [];
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
    return <>{icons.map((icon, index) => <React.Fragment key={index}>{icon}</React.Fragment>)}</>;
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* Other card content */}
      <CardActions disableSpacing>
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
