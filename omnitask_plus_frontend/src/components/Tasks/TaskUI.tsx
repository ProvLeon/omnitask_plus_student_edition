import { useState, useEffect } from 'react';
import { Button, Modal, Box, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent } from '@mui/material';
import TaskForm from './TaskForm';
import CloseIcon from '@mui/icons-material/Close';
import { getTasks } from '../apis/TaskApi'; // Updated import to use getTasks from TaskApi
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'; // Updated import to use @cyntler/react-doc-viewer

interface Task {
  id: number;
  title: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  start_date: string;
  end_date: string;
  status: 'todo' | 'in progress' | 'completed';
  media?: string; // Optional media URL
}

const priorityLevels = { 'high': 1, 'medium': 2, 'low': 3 };

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const TaskUI = () => {
  const [open, setOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchTasks = async () => {
      let tasksData = await getTasks(); // Updated to use getTasks from TaskApi
      // Sort tasks by priority and then by date
      tasksData.sort((a: Task, b: Task) => {
        return priorityLevels[a.priority] - priorityLevels[b.priority] || new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      });
      setTasks(tasksData);
      console.log(tasksData)
    };
    fetchTasks();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMediaOpen = (mediaUrl: string) => {
    setSelectedMedia(mediaUrl);
    // console.log(mediaUrl)
    setMediaOpen(true);
  };
  const handleMediaClose = () => setMediaOpen(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
  };

  return (
    <div style={{ filter: open ? 'blur(4px)' : 'none', pointerEvents: open ? 'none' : 'auto' }}>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Task
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-task-modal"
        aria-describedby="create-task-form"
      >
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <TaskForm />
        </Box>
      </Modal>
      <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
        Tasks
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: isMobile ? 200 : 650 }} aria-label="task table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Priority</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Media</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow
                key={task.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, border: 1, borderColor: 'divider' }}
              >
                <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'divider' }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ borderRight: 1, borderColor: 'divider' }}>
                  {task.title}
                </TableCell>
                <TableCell align="right" sx={{ borderRight: 1, borderColor: 'divider' }}>{task.priority}</TableCell>
                <TableCell align="right" sx={{ borderRight: 1, borderColor: 'divider' }}>{task.description}</TableCell>
                <TableCell align="right" sx={{ borderRight: 1, borderColor: 'divider' }}>{formatDate(task.start_date)}</TableCell>
                <TableCell align="right" sx={{ borderRight: 1, borderColor: 'divider' }}>{formatDate(task.end_date)}</TableCell>
                <TableCell align="right">{task.status}</TableCell>
                <TableCell align="right" sx={{ cursor: 'pointer' }} onClick={() => task.media && handleMediaOpen(task.media)}>View</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={mediaOpen} onClose={handleMediaClose}>
        <DialogTitle>Task Media</DialogTitle>
        <DialogContent>
          {selectedMedia ? (
            isImage(selectedMedia) ? (
              <img src={selectedMedia} alt="Task Media" style={{ width: '100%' }} />
            ) : (
              <DocViewer
                pluginRenderers={DocViewerRenderers}
                documents={[{ uri: selectedMedia }]}
                style={{ width: '100%', height: '500px' }}
              />
            )
          ) : (
            <Typography>No Media Available</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TaskUI

