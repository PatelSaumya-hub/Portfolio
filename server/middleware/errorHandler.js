// Global structured error handling middleware for Mongoose & Express

const errorHandler = (err, req, res, next) => {
  console.error('Error caught by handler:', err.name, err.message);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors).map(key => ({
      field: key,
      message: err.errors[key].message
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors,
      message: errors.map(e => e.message).join(', ')
    });
  }

  // Mongoose Bad ObjectId / Cast Error
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json({
      success: false,
      error: 'Resource Not Found',
      message: `No task found with ID: ${err.value}`
    });
  }

  // Duplicate key error
  if (err.code && err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate Key Error',
      message: 'A resource with this key already exists.'
    });
  }

  // Default server error
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server.'
  });
};

export default errorHandler;
