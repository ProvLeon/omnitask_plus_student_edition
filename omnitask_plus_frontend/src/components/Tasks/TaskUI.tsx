import { useState, useEffect, useMemo } from 'react';
import { Button, Modal, Box, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, TableSortLabel } from '@mui/material';
import TaskForm from './TaskForm';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTasks, deleteTask } from '../apis/TaskApi';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

interface Task {
  id: number;
  title: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  start_date: string;
  end_date: string;
  status: 'todo' | 'in progress' | 'completed';
  media?: string;
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
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Task>('start_date');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchTasks = async () => {
      let tasksData = await getTasks();
      setTasks(tasksData);
    };
    fetchTasks();
  }, []);

  const handleRequestSort = (property: keyof Task) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedTasks = useMemo(() => {
    return tasks.sort((a, b) => {
      let comparison = 0;
      if (orderBy === 'priority') {
        comparison = priorityLevels[a.priority] - priorityLevels[b.priority];
      } else if (orderBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else {
        const aValue = a[orderBy] || '';
        const bValue = b[orderBy] || '';
        comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
      }
      return orderDirection === 'asc' ? comparison : -comparison;
    });
  }, [tasks, orderBy, orderDirection]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMediaOpen = (mediaUrl: string) => {
    setSelectedMedia(mediaUrl);
    setMediaOpen(true);
  };
  const handleMediaClose = () => setMediaOpen(false);

  const handleDeleteTask = async (taskId: number) => {
    await deleteTask(taskId.toString());
    setTasks(tasks.filter(task => task.id !== taskId));
  };

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
    <div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-task-modal-title"
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
      <Typography variant="h4" sx={{ mt: 5, mb: 2, textAlign: 'center' }}>
        Tasks
        <Button variant="contained" onClick={handleOpen} sx={{ ml: 2, mb: 2, alignSelf: 'center' }}>
        Create Task
      </Button>
      </Typography>
      <TableContainer component={Paper} sx={{marginLeft: '5%', marginRight: '5%'}}>
        <Table sx={{ minWidth: isMobile ? 200 : 960 }} aria-label="task table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'priority'}
                  direction={orderBy === 'priority' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('priority')}
                >
                  PRIORITY
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">DESCRIPTION</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'start_date'}
                  direction={orderBy === 'start_date' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('start_date')}
                >
                  START DATE
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'end_date'}
                  direction={orderBy === 'end_date' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('end_date')}
                >
                  END DATE
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? orderDirection : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  STATUS
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">MEDIA</TableCell>
              <TableCell align="right">DELETE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTasks.map((task, index) => (
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
                <TableCell align="right">
                  {task.media ? (
                    <Button onClick={() => task.media && handleMediaOpen(task.media)}>View</Button>
                  ) : (
                    <Typography>No Media</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
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
                documents={[{ uri: selectedMedia, fileType: selectedMedia.split('.').pop() }]}
                config={{
                  header: {
                    disableHeader: true,
                    disableFileName: true,
                    retainURLParams: true
                  }
                }}
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
