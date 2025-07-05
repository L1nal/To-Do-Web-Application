class ErrorHandler {
  static handleError(err, req, res, next) {
    console.error('Error:', err);

    // Handle null/undefined errors
    if (!err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON format' });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }

  static notFound(req, res, next) {
    res.status(404).json({ error: 'Route not found' });
  }
}

module.exports = ErrorHandler; 