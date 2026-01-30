import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';

function TaskFilters({ filters, onFilterChange }) {
  const handleChange = (field) => (event) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      status: 'all',
      priority: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.priority !== '';

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <FilterIcon sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary' }} />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={filters.status}
            onChange={handleChange('status')}
            label="Status"
            inputProps={{
              'aria-labelledby': 'status-filter-label',
            }}
          >
            <MenuItem value="all">All Tasks</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="priority-filter-label">Priority</InputLabel>
          <Select
            labelId="priority-filter-label"
            value={filters.priority}
            onChange={handleChange('priority')}
            label="Priority"
            inputProps={{
              'aria-labelledby': 'priority-filter-label',
            }}
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            value={filters.sortBy}
            onChange={handleChange('sortBy')}
            label="Sort By"
            inputProps={{
              'aria-labelledby': 'sort-by-label',
            }}
          >
            <MenuItem value="created_at">Date Created</MenuItem>
            <MenuItem value="due_date">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="sort-order-label">Order</InputLabel>
          <Select
            labelId="sort-order-label"
            value={filters.sortOrder}
            onChange={handleChange('sortOrder')}
            label="Order"
            inputProps={{
              'aria-labelledby': 'sort-order-label',
            }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button
            variant="text"
            size="small"
            onClick={handleClearFilters}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Clear Filters
          </Button>
        )}
      </Stack>

      {hasActiveFilters && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {filters.status !== 'all' && (
            <Chip
              label={`Status: ${filters.status}`}
              size="small"
              onDelete={() => handleChange('status')({ target: { value: 'all' } })}
            />
          )}
          {filters.priority && (
            <Chip
              label={`Priority: ${filters.priority}`}
              size="small"
              onDelete={() => handleChange('priority')({ target: { value: '' } })}
            />
          )}
        </Stack>
      )}
    </Box>
  );
}

TaskFilters.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default TaskFilters;
