const ErrorHandler = require('../../middleware/errorHandler');

describe('ErrorHandler Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      url: '/test'
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('notFound', () => {
    it('should return 404 status and error message', () => {
      ErrorHandler.notFound(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Route not found'
      });
    });

    it('should include request method and URL in error message', () => {
      mockReq.method = 'POST';
      mockReq.url = '/api/tasks';

      ErrorHandler.notFound(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Route not found'
      });
    });
  });

  describe('handleError', () => {
    it('should handle general errors with 500 status', () => {
      const error = new Error('Something went wrong');

      ErrorHandler.handleError(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error'
      });
    });

    it('should handle validation errors with 400 status', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';

      ErrorHandler.handleError(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Validation failed'
      });
    });

    it('should handle JSON parse errors with 400 status', () => {
      const error = new Error('Invalid JSON');
      error.type = 'entity.parse.failed';

      ErrorHandler.handleError(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid JSON format'
      });
    });

    it('should handle errors without message', () => {
      const error = new Error();

      ErrorHandler.handleError(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error'
      });
    });

    it('should handle non-Error objects', () => {
      const error = 'String error';

      ErrorHandler.handleError(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error'
      });
    });

    it('should handle null/undefined errors', () => {
      ErrorHandler.handleError(null, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error'
      });
    });

    it('should handle database connection errors', () => {
      const error = new Error('ECONNREFUSED');
      error.code = 'ECONNREFUSED';

      ErrorHandler.handleError(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error'
      });
    });
  });


}); 