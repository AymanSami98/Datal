// middleware/notFound.js

// Custom middleware for handling "Not Found" responses
function notFound(req, res, next) {
    res.status(404).json({ message: 'Route not found' });
  }
  
  export default notFound;
  