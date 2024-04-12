import { useState, useEffect, useMemo } from 'react';
import { Button, Modal, Box, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, TableSortLabel } from '@mui/material';
import TaskForm from './TaskForm';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTasks, deleteTask } from '../apis/TaskApi';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { returnUserAvatars } from '../../utils/utils';
import { Empty } from 'antd'; // Importing ant design Empty component for beautiful no tasks animation

interface Task {
  id: number;
  title: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  start_date: string;
  end_date: string;
  status: 'todo' | 'in progress' | 'completed';
  media?: string;
  persons_responsible: [];
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
  const isExtraSmall = useMediaQuery('(max-width:740px)');
  const [avatars, setAvatars] = useState<{ [key: number]: JSX.Element }>({});

  useEffect(() => {
    const fetchTasks = async () => {
      let tasksData = await getTasks();
      console.log(tasksData)
      setTasks(tasksData);
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchAvatars = async () => {
      const avatarsMapping: { [key: number]: JSX.Element } = {};
      for (const task of tasks) {
        avatarsMapping[task.id] = await returnUserAvatars(task.persons_responsible);
      }
      setAvatars(avatarsMapping);
    };

    if (tasks.length > 0) {
      fetchAvatars();
    }
  }, [tasks]);

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
        const aValue = typeof a[orderBy] === 'string' || typeof a[orderBy] === 'number' ? a[orderBy] : '';
        const bValue = typeof b[orderBy] === 'string' || typeof b[orderBy] === 'number' ? b[orderBy] : '';
        if (aValue && bValue) {
          comparison = new Date(aValue.toString() || '').getTime() - new Date(bValue.toString() || '').getTime();
        }
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
    width: isMobile ? '90%' : 400,
    bgcolor: 'background.paper',
    boxShadow: 60,
    p: 4,
    overflowY: 'auto',
    maxHeight: '90vh',
    borderRadius: '10px',
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp)$/i.test(url);
  };

  const fontSizeResponsive = isMobile ? '0.7rem' : isExtraSmall ? '0.75rem' : '0.8rem';

  const taskForm = () => {
    return (
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
    )
  }


  return (
    <div className='w-full md:auto rounded-sm'>
      {tasks.length === 0 ? (
        <>
        <Empty description={<span>No tasks, <Button onClick={handleOpen} variant="contained">Create Task</Button></span>} />
        {taskForm()}
        </>
      ) : (
        <>
        {taskForm()}
          <Typography variant={isMobile ? "h6" : "h4"} sx={{ mt: 5, mb: 2, textAlign: 'center' }}>
            Tasks
            <Button variant="contained" onClick={handleOpen} sx={{ ml: 2, mb: 2, alignSelf: 'center', fontSize: fontSizeResponsive }}>
            Create Task
          </Button>
          </Typography>
          <Box sx={{  margin: '5%' }}>
            <TableContainer component={Paper} sx={{ maxHeight: '70vh', maxWidth: '100vw' }}>
              <Table sx={{ minWidth: isMobile ? 200 : 960 }} aria-label="task table" size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: fontSizeResponsive }}>#</TableCell>
                    <TableCell sx={{ fontSize: fontSizeResponsive }}>Title</TableCell>
                    <TableCell align="right" sx={{ fontSize: fontSizeResponsive }}>
                      <TableSortLabel
                        active={orderBy === 'priority'}
                        direction={orderBy === 'priority' ? orderDirection : 'asc'}
                        onClick={() => handleRequestSort('priority')}
                      >
                        PRIORITY
                      </TableSortLabel>
                    </TableCell>
                    {isMobile ? null : <TableCell align="right" sx={{ fontSize: fontSizeResponsive }}>DESCRIPTION</TableCell>}
                    <TableCell align="right" sx={{ fontSize: fontSizeResponsive }}>
                      <TableSortLabel
                        active={orderBy === 'start_date'}
                        direction={orderBy === 'start_date' ? orderDirection : 'asc'}
                        onClick={() => handleRequestSort('start_date')}
                      >
                        START DATE
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: fontSizeResponsive }}>
                      <TableSortLabel
                        active={orderBy === 'end_date'}
                        direction={orderBy === 'end_date' ? orderDirection : 'asc'}
                        onClick={() => handleRequestSort('end_date')}
                      >
                        END DATE
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: fontSizeResponsive }}>STATUS</TableCell>
                    <TableCell align="right" sx={{ fontSize: fontSizeResponsive, backgroundColor: '' }}>
                      PERSON RESPONSIBLE
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: fontSizeResponsive }}>MEDIA</TableCell>
                    <TableCell align="right" sx={{ fontSize: fontSizeResponsive }}>DELETE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedTasks.map((task, index) => (
                    <TableRow
                      key={task.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, border: 1, borderColor: 'divider' }}
                    >
                      <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'divider', fontSize: fontSizeResponsive }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ borderRight: 1, borderColor: 'divider', fontSize: fontSizeResponsive }}>
                        {task.title}
                      </TableCell>
                      <TableCell align="right" sx={{ borderRight: 1, borderColor: 'divider', fontSize: fontSizeResponsive }}>{task.priority}</TableCell>
                      {isMobile ? null : <TableCell align="right" sx={{ borderRight: 1, borderColor: 'divider', fontSize: fontSizeResponsive }}>{task.description}</TableCell>}
                      <TableCell align="right" sx={{ borderRight: 1, borderColor: 'divider', fontSize: fontSizeResponsive }}>{formatDate(task.start_date)}</TableCell>
                      <TableCell align="right" sx={{ borderRight: 1, borderColor: 'divider', fontSize: fontSizeResponsive }}>{formatDate(task.end_date)}</TableCell>
                      <TableCell align="right" sx={{ fontSize: fontSizeResponsive }}>{task.status}</TableCell>
                      <TableCell align="right" sx={{ fontSize: fontSizeResponsive, backgroundColor: '' }}>{avatars[task.id]}</TableCell>
                      <TableCell align="right" sx={{ fontSize: fontSizeResponsive }}>
                        {task.media ? (
                          <Button onClick={() => task.media && handleMediaOpen(task.media)} sx={{ fontSize: fontSizeResponsive }}>View</Button>
                        ) : (
                          <Typography sx={{ fontSize: fontSizeResponsive }}>No Media</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDeleteTask(task.id)} sx={{ fontSize: fontSizeResponsive }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
      <Dialog open={mediaOpen} onClose={handleMediaClose}>
        <DialogTitle sx={{ fontSize: fontSizeResponsive }}>Task Media</DialogTitle>
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
            <Typography sx={{ fontSize: fontSizeResponsive }}>No Media Available</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TaskUI

