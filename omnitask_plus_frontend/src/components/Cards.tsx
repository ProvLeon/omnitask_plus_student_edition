import * as React from 'react';
// Importing necessary components and styles from MUI
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { LinearProgress, Select, MenuItem, Avatar } from '@mui/material';
// Importing icons from MUI
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { red } from '@mui/material/colors';

// Interface for CardProps to type-check the props passed to the Cards component
interface CardProps {
  title: string;
  description: string;
  priority: string;
  progress: number;
  date: Date;
  image: string | undefined;
  personResponsible: { name: string; image: string };
}

// Interface for ExpandMoreProps to type-check the props passed to the ExpandMore component
interface ExpandMoreProps {
  expand: boolean;
  [key: string]: any; // This allows for other props without explicitly defining them
}

// Styled component for the expand button with rotation animation
const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

// Cards component definition
const Cards = ({
  title,
  description,
  priority: initialPriority,
  progress,
  date,
  image,
  personResponsible,
}: CardProps) => {
  const [expanded, setExpanded] = React.useState(false); // State for managing card expansion
  const [priority, setPriority] = React.useState<string>(initialPriority); // State for managing task priority
  // State for managing theme (light/dark)
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

  // Effect hook to listen for theme changes in localStorage
  React.useEffect(() => {
    const handleThemeChange = () => {
      const updatedColorScheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
      setTheme(updatedColorScheme);
      console.log(updatedColorScheme);
    };

    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  // Function to toggle card expansion
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Rendering the card component with conditional styling based on the theme
  return (
    <Card sx={{ maxWidth: 300, background: theme === 'dark' ? '#101010' : 'white', color: theme === 'dark' ? 'white' : 'black' }}>
      <CardHeader
        title={title}
        subheader={date.toLocaleDateString()}
        action={
          // Priority selector dropdown
          <Select
            sx={{ border: 'none', borderRadius: 50, width: 82, height: 20, fontSize: '10px' }}
            className={`  ${priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-yellow-500' : priority === 'Low' ? 'bg-green-500' : theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-300'}`}
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value as string);
            }}
          >
            <MenuItem aria-label="None" value="">
              Priority
            </MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        }
      />

      <CardContent sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ color: theme === 'dark' ? 'white' : 'black' }}>
          Description:
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ color: theme === 'dark' ? 'white' : 'black' }}>
          {description.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </Typography>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ padding: 2 }}>
          <Typography variant="h6" sx={{ color: theme === 'dark' ? 'white' : 'black' }}>
            More Details:
          </Typography>
          <Typography paragraph variant="body2" color="text.secondary" sx={{ color: theme === 'dark' ? 'white' : 'black' }}>
            {description.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Typography>
        </CardContent>
        {image ? (
          <CardMedia component="img" height="194" image={image} alt="Paella dish" />
        ) : null}
      </Collapse>

      <CardActions disableSpacing>
        <Typography sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, fontSize: '12px' }}>
          <LinearProgress sx={{ width: '200px', borderRadius: 50 }} value={progress} variant="determinate" />
          {progress}%
        </Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <Typography sx={{ paddingX: 2, fontSize: '12px', fontWeight: 'medium', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginLeft: 'auto' }}>
          <Avatar sx={{ bgcolor: red[500], width: '20px', height: '20px' }} aria-label="avatar">
            {personResponsible.image}
          </Avatar>
          {personResponsible.name}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default Cards;
