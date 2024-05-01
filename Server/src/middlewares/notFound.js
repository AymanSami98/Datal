// Custom middleware for handling "Not Found" responses
function notFound(req, res, next) {
  res.status(404).json({ message: 'Route not found' });
  // Do not call next() after sending response
}

export default notFound;
