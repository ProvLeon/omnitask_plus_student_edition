import { Box, Typography, Grid, Card, CardContent, CardMedia, IconButton, Button } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import ExploreIcon from '@mui/icons-material/Explore';
import teamPhoto from '../../assets/images/team_photo.jpg'; // Assuming a team photo exists in the assets

const AboutSection = ({id}: {id:string}) => {
  return (
    <Box id={id} sx={{ flexGrow: 1, padding: '50px', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        About OmniTask+ Student Edition
      </Typography>
      <Typography variant="h5" gutterBottom align="center" color="textSecondary">
        Elevate Your Productivity
      </Typography>
      <Box sx={{ marginTop: '25px' }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card sx={{ maxWidth: 345, margin: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: '0.3s', '&:hover': { boxShadow: '0 8px 16px rgba(0,0,0,0.3)' } }}>
              <CardMedia
                component="img"
                height="140"
                image={teamPhoto}
                alt="OmniTask+ Team"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Our Inspiration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The inspiration behind OmniTask+ stems from the challenges faced by students in managing their tasks and collaborating effectively, especially in remote learning environments. This project, a Portfolio Project for Holberton School, aims to address these challenges by providing a comprehensive solution.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom color="primary">
              Meet the Team
            </Typography>
            <Typography paragraph>
              OmniTask+ was brought to life by a dedicated team of developers passionate about enhancing student productivity. Get to know the brains behind this project:
            </Typography>
            <div className='flex flex-col gap-10'>
            <div>
            <Box>
              <Typography variant="h6">Lomotey Okantah Emmanuel</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton href={import.meta.env.VITE_LINKEDIN_LINK} target="_blank" rel="noopener">
                  <LinkedInIcon />
                </IconButton>
                <IconButton href={import.meta.env.VITE_GITHUB_LINK} target="_blank" rel="noopener">
                  <GitHubIcon />
                </IconButton>
                <IconButton href={import.meta.env.VITE_TWITTER_LINK} target="_blank" rel="noopener">
                  <XIcon />
                </IconButton>
              </Box>
            </Box>
            </div>
            <div>
            <Typography variant="h5" gutterBottom color="primary">
              Explore Our Project
            </Typography>
            <Typography paragraph>
              Dive deeper into what makes OmniTask+ a unique tool for students. Check out our project repository:
            </Typography>
            <Typography paragraph>
              <Button variant="outlined" color="primary" href="https://github.com/ProvLeon/omnitask_plus_student_edition" target="_blank" rel="noopener" startIcon={<ExploreIcon />}>
                Discover More
              </Button>
            </Typography>
            </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AboutSection;
