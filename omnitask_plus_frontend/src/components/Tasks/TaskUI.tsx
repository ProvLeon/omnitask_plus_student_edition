import  { useState } from 'react';
import { Button, Modal, Box, IconButton } from '@mui/material';
import TaskForm from './TaskForm';
import CloseIcon from '@mui/icons-material/Close';

const TaskUI = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
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
        <Box sx={style}>
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
      {/* Placeholder for tasks view */}
      <div className="tasks-view">
        {/* Tasks will be dynamically loaded here */}
      </div>
    </div>
  );
}

export default TaskUI
