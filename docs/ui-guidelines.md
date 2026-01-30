# UI Guidelines

## Overview
This document outlines the user interface guidelines and design standards for the task management application. All UI components should follow these guidelines to ensure consistency, accessibility, and a polished user experience.

## Component Library

### Material-UI (MUI)
- The application **must** use Material-UI (MUI) components as the primary component library
- Version: MUI v5 or higher
- All UI components should leverage MUI's built-in components when possible
- Custom components should follow Material Design principles

### Required MUI Components
- **Buttons**: `Button`, `IconButton`, `Fab`
- **Inputs**: `TextField`, `Checkbox`, `Select`, `DatePicker`
- **Layout**: `Container`, `Grid`, `Box`, `Stack`
- **Feedback**: `Snackbar`, `Alert`, `CircularProgress`, `LinearProgress`
- **Data Display**: `List`, `ListItem`, `Card`, `Chip`, `Tooltip`
- **Navigation**: `AppBar`, `Drawer`, `Tabs`

## Color Palette

### Primary Colors
```css
Primary Main: #1976d2 (Blue)
Primary Light: #42a5f5
Primary Dark: #1565c0
```

### Secondary Colors
```css
Secondary Main: #9c27b0 (Purple)
Secondary Light: #ba68c8
Secondary Dark: #7b1fa2
```

### Semantic Colors
```css
Success: #2e7d32 (Green)
Warning: #ed6c02 (Orange)
Error: #d32f2f (Red)
Info: #0288d1 (Light Blue)
```

### Neutral Colors
```css
Background Default: #fafafa
Background Paper: #ffffff
Text Primary: rgba(0, 0, 0, 0.87)
Text Secondary: rgba(0, 0, 0, 0.6)
Text Disabled: rgba(0, 0, 0, 0.38)
Divider: rgba(0, 0, 0, 0.12)
```

### Task Status Colors
```css
Completed Task: #4caf50 (Green)
Overdue Task: #f44336 (Red)
Due Today: #ff9800 (Orange)
Standard Task: #757575 (Gray)
```

### Priority Colors
```css
High Priority: #d32f2f (Red)
Medium Priority: #f57c00 (Orange)
Low Priority: #1976d2 (Blue)
```

## Button Styles

### Primary Buttons
- **Usage**: Main actions, form submissions
- **Style**: `variant="contained"` with `color="primary"`
- **Example**: "Create Task", "Save", "Submit"
```jsx
<Button variant="contained" color="primary">
  Create Task
</Button>
```

### Secondary Buttons
- **Usage**: Supporting actions, less prominent actions
- **Style**: `variant="outlined"` with `color="primary"`
- **Example**: "Cancel", "Back", "Reset"
```jsx
<Button variant="outlined" color="primary">
  Cancel
</Button>
```

### Text Buttons
- **Usage**: Tertiary actions, inline actions
- **Style**: `variant="text"` with appropriate color
- **Example**: "Learn More", "Skip", "Close"
```jsx
<Button variant="text" color="primary">
  Learn More
</Button>
```

### Icon Buttons
- **Usage**: Actions with clear iconography
- **Style**: `IconButton` component with appropriate icon
- **Example**: Delete, Edit, More Options
```jsx
<IconButton aria-label="delete">
  <DeleteIcon />
</IconButton>
```

### Floating Action Button (FAB)
- **Usage**: Primary action on a screen
- **Style**: `Fab` component with `color="primary"`
- **Example**: Add new task
```jsx
<Fab color="primary" aria-label="add">
  <AddIcon />
</Fab>
```

### Button States
- **Disabled**: Use `disabled` prop for unavailable actions
- **Loading**: Show `CircularProgress` inside button during async operations
- **Size**: Default to `medium`, use `small` or `large` when contextually appropriate

## Typography

### Font Family
- Primary: Roboto (default MUI font)
- Fallback: "Helvetica Neue", Arial, sans-serif

### Typography Scale
- **h1**: 96px, light, -1.5px letter spacing
- **h2**: 60px, light, -0.5px letter spacing
- **h3**: 48px, regular, 0px letter spacing
- **h4**: 34px, regular, 0.25px letter spacing
- **h5**: 24px, regular, 0px letter spacing
- **h6**: 20px, medium, 0.15px letter spacing
- **body1**: 16px, regular, 0.5px letter spacing (default body text)
- **body2**: 14px, regular, 0.25px letter spacing
- **button**: 14px, medium, 0.75px letter spacing, uppercase
- **caption**: 12px, regular, 0.4px letter spacing
- **overline**: 12px, regular, 1.5px letter spacing, uppercase

## Spacing

### Grid System
- Use MUI's Grid component with 8px base unit
- Container max-width: `lg` (1280px) or `xl` (1920px)
- Standard spacing multipliers: 0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12

### Component Spacing
- **Margins**: Use `m`, `mt`, `mr`, `mb`, `ml`, `mx`, `my` props
- **Padding**: Use `p`, `pt`, `pr`, `pb`, `pl`, `px`, `py` props
- **Gap**: Use `gap` prop in Stack or Grid components

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance
The application must meet WCAG 2.1 Level AA standards:

#### 1. Keyboard Navigation
- **All interactive elements must be keyboard accessible**
- Support Tab, Shift+Tab for navigation
- Support Enter and Space for activation
- Support Escape to close dialogs and menus
- Provide visible focus indicators (outline or highlight)
- Implement logical tab order

#### 2. Screen Reader Support
- **All interactive elements must have proper ARIA labels**
- Use `aria-label` or `aria-labelledby` for buttons and inputs
- Use `aria-describedby` for additional context
- Use `role` attributes where appropriate
- Provide live region updates with `aria-live` for dynamic content
- Ensure proper heading hierarchy (h1 → h2 → h3)

#### 3. Color Contrast
- **Minimum contrast ratios:**
  - Normal text: 4.5:1
  - Large text (18pt+): 3:1
  - UI components and graphics: 3:1
- **Never use color as the only indicator** (use icons, text, patterns)
- Test all color combinations for contrast compliance

#### 4. Text Alternatives
- Provide `alt` text for all images
- Use descriptive text for icon buttons (`aria-label`)
- Provide captions or transcripts for multimedia content

#### 5. Focus Management
- Maintain logical focus order
- Trap focus within modal dialogs
- Return focus to trigger element when closing dialogs
- Provide skip navigation links

#### 6. Forms and Inputs
- **All form inputs must have associated labels**
- Use `<label>` elements or `aria-label`
- Provide clear error messages with `aria-invalid` and `aria-describedby`
- Display validation errors inline near the input
- Support autofill and autocomplete where appropriate

#### 7. Touch Target Size
- Minimum touch target size: 44x44 pixels
- Provide adequate spacing between interactive elements
- Ensure buttons and links are easy to tap on mobile devices

#### 8. Responsive Text
- Support browser zoom up to 200%
- Use relative units (rem, em) instead of fixed pixels
- Allow text reflow without horizontal scrolling
- Do not disable pinch-to-zoom on mobile

#### 9. Motion and Animation
- Respect `prefers-reduced-motion` user preference
- Provide options to disable non-essential animations
- Keep animations under 5 seconds
- Avoid flashing content (no more than 3 flashes per second)

#### 10. Error Prevention and Recovery
- Provide clear error messages
- Offer suggestions for fixing errors
- Allow users to undo or cancel actions
- Confirm before destructive actions (delete, etc.)

### Testing Requirements
- Test with keyboard only (no mouse)
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Validate color contrast with tools (Contrast Checker, Lighthouse)
- Run automated accessibility audits (axe, Lighthouse)
- Perform manual testing with assistive technologies

## Responsive Design

### Breakpoints
Use MUI's default breakpoints:
- **xs**: 0px (mobile)
- **sm**: 600px (tablet)
- **md**: 900px (small laptop)
- **lg**: 1200px (desktop)
- **xl**: 1536px (large desktop)

### Mobile-First Approach
- Design for mobile first, then scale up
- Use responsive Grid system
- Hide/show components based on screen size with `sx={{ display: { xs: 'none', md: 'block' } }}`
- Adjust typography scales for smaller screens
- Optimize touch interactions on mobile

## Component-Specific Guidelines

### Task Cards
- Use `Card` component with elevation 1 or 2
- Include `CardContent` and `CardActions`
- Display task title prominently (h6 or subtitle1)
- Show priority indicator with colored left border or chip
- Show completion status with checkbox
- Include action buttons (Edit, Delete) in CardActions

### Forms
- Use `TextField` with `variant="outlined"`
- Provide clear labels above or within inputs
- Display validation errors below inputs
- Use `FormHelperText` for hints and errors
- Group related inputs with `FormGroup` or `Stack`

### Lists
- Use `List` and `ListItem` for task lists
- Include `ListItemText` with primary and secondary text
- Add `ListItemIcon` for visual indicators
- Use `Divider` between list items when appropriate

### Dialogs
- Use `Dialog` component for modals
- Include `DialogTitle`, `DialogContent`, and `DialogActions`
- Provide clear title describing the dialog purpose
- Place primary action on the right in DialogActions
- Support Escape key to close

### Loading States
- Use `CircularProgress` for indeterminate loading
- Use `LinearProgress` for determinate progress
- Show skeleton loading for content (optional)
- Disable interactive elements during loading

## Best Practices

### Consistency
- Use the same component for the same purpose throughout the app
- Maintain consistent spacing and alignment
- Follow established patterns from Material Design

### Feedback
- Provide immediate visual feedback for user actions
- Use Snackbar for success/error notifications
- Show loading states for async operations
- Indicate clickable elements with cursor: pointer

### Performance
- Lazy load components when possible
- Optimize images and assets
- Minimize re-renders with proper React optimization
- Use MUI's `sx` prop for efficient styling

### Internationalization
- Design UI to accommodate text expansion (30-40%)
- Use date/time formats appropriate to locale
- Support RTL (right-to-left) languages if needed
