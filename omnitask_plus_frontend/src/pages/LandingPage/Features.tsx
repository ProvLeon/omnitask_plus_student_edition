import { Box, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import landingPageInfo from './landing_page_info.json';

interface Feature {
  image: string;
  name: string;
  description: string;
}

// Import images
import taskManagementImage from '../../assets/images/task_management.png';
import pomodoroTimerImage from '../../assets/images/pomodoro_timer.png';
import virtualStudySessionsImage from '../../assets/images/virtual_study_sessions.png';

// Image map
const imageMap : { [key: string]: string } = {
  "../../assets/images/task_management.png": taskManagementImage,
  "../../assets/images/pomodoro_timer.png": pomodoroTimerImage,
  "../../assets/images/virtual_study_sessions.png": virtualStudySessionsImage,
};

const featuresData: Feature[] = (landingPageInfo.sections.find(section => section.name === "Features") as { content: Feature[] })?.content.map(({ image, name, description }) => ({
  image: imageMap[image], // Use the imageMap to resolve the path
  name,
  description,
})) || [];

const FeaturesSection = ({id}: {id:string}) => {
  return (
    <Box id={id} sx={{ margin: '80px 20px 20px 20px',
    transition: '0.3s',
    '&:hover': {
      boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
    },
    flexGrow: 1, padding: '0 50px 100px 50px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 20px rgba(0,0,0,0.25)', borderRadius: '8px', overflow: 'hidden' }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ padding: '70px', textShadow: '1px 1px 5px rgba(0,0,0,0.2)' }}>
        Features
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {featuresData.map((feature: Feature, index: number) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex', flexDirection: 'column', minHeight: 390, maxWidth: 345, boxShadow: '0 12px 24px -12px rgba(0,0,0,0.3), 0 4px 8px 0 rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02)', transition: '0.3s', '&:hover': { boxShadow: '0 16px 32px -16px rgba(0,0,0,0.3), 0 8px 16px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.02)', transform: 'translateY(-5px)' } }}>
              <CardMedia
                component="img"
                height= {200}
                width= {300}
                image= {feature.image}
                alt={feature.name}
                sx={{ filter: 'brightness(90%)', width: '200px', padding: '20px', alignSelf: 'center' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center',  textShadow: '1px 1px 3px rgba(0,0,0,0.1)' }}>
                  {feature.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturesSection;
