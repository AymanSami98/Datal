
function notFound(req, res, next) {
    res.status(400).json({ message: 'Server error' });
    next();
  }
  
  export default notFound;
  