import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function TaskForm({ open, task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        due_date: task.due_date ? dayjs(task.due_date) : null,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: null,
      });
    }
    setErrors({});
  }, [task, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const taskData = {
      ...formData,
      due_date: formData.due_date ? formData.due_date.format('YYYY-MM-DD') : null,
    };

    onSave(taskData);
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      due_date: date,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="task-form-dialog-title"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="task-form-dialog-title">
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>

          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Title"
                value={formData.title}
                onChange={handleChange('title')}
                error={!!errors.title}
                helperText={errors.title}
                required
                fullWidth
                autoFocus
                inputProps={{
                  'aria-required': true,
                  'aria-invalid': !!errors.title,
                  'aria-describedby': errors.title ? 'title-error' : undefined,
                }}
              />

              <TextField
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                fullWidth
                inputProps={{
                  'aria-invalid': !!errors.description,
                  'aria-describedby': errors.description ? 'description-error' : undefined,
                }}
              />

              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  value={formData.priority}
                  onChange={handleChange('priority')}
                  label="Priority"
                  inputProps={{
                    'aria-labelledby': 'priority-label',
                  }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>

              <DatePicker
                label="Due Date"
                value={formData.due_date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    helperText: 'Optional - Select a due date for this task',
                  },
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}

TaskForm.propTypes = {
  open: PropTypes.bool.isRequired,
  task: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    priority: PropTypes.oneOf(['low', 'medium', 'high']),
    due_date: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TaskForm;
