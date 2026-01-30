import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Checkbox,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

const priorityColors = {
  low: '#1976d2',
  medium: '#f57c00',
  high: '#d32f2f',
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const isOverdue = task.due_date && !task.completed && dayjs(task.due_date).isBefore(dayjs(), 'day');
  const isDueToday = task.due_date && dayjs(task.due_date).isSame(dayjs(), 'day');

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    onToggleComplete(task.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <Card
      sx={{
        borderLeft: `4px solid ${priorityColors[task.priority]}`,
        opacity: task.completed ? 0.7 : 1,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Checkbox
            checked={task.completed === 1}
            onChange={handleCheckboxChange}
            inputProps={{
              'aria-label': `Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`,
            }}
            sx={{ mt: -1 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
                mb: 1,
              }}
            >
              {task.title}
            </Typography>

            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              >
                {task.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip
                label={priorityLabels[task.priority]}
                size="small"
                sx={{
                  backgroundColor: priorityColors[task.priority],
                  color: 'white',
                  fontWeight: 'medium',
                }}
              />

              {task.due_date && (
                <Chip
                  icon={<CalendarIcon />}
                  label={dayjs(task.due_date).format('MMM D, YYYY')}
                  size="small"
                  color={isOverdue ? 'error' : isDueToday ? 'warning' : 'default'}
                  variant={isOverdue || isDueToday ? 'filled' : 'outlined'}
                />
              )}

              {isOverdue && (
                <Typography variant="caption" color="error" sx={{ fontWeight: 'medium' }}>
                  Overdue
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <IconButton
          onClick={handleEdit}
          size="small"
          aria-label={`Edit task "${task.title}"`}
          color="primary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={handleDelete}
          size="small"
          aria-label={`Delete task "${task.title}"`}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    completed: PropTypes.number.isRequired,
    priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    due_date: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
};

export default TaskCard;
