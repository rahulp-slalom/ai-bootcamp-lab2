const Joi = require('joi');

/**
 * Validation schema for creating a task
 */
const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 1 character',
    'string.max': 'Title must not exceed 200 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().max(1000).allow(null, '').messages({
    'string.max': 'Description must not exceed 1000 characters',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').messages({
    'any.only': 'Priority must be low, medium, or high',
  }),
  due_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Due date must be in YYYY-MM-DD format',
    }),
});

/**
 * Validation schema for updating a task
 */
const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).messages({
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 1 character',
    'string.max': 'Title must not exceed 200 characters',
  }),
  description: Joi.string().max(1000).allow(null, '').messages({
    'string.max': 'Description must not exceed 1000 characters',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').messages({
    'any.only': 'Priority must be low, medium, or high',
  }),
  due_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Due date must be in YYYY-MM-DD format',
    }),
  completed: Joi.number().valid(0, 1).messages({
    'any.only': 'Completed must be 0 or 1',
  }),
}).min(1);

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
    }

    req.validatedBody = value;
    next();
  };
}

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  validate,
};
