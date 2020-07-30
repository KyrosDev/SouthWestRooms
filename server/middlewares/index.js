function notFound(req, res, next) {
  res.status(404); // Set 'Not Found' status
  const error = new Error(`Not Found - URL: ${req.originalUrl}`); 
  next(error); // Respond with error
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500); // Get status code or set it as 500
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥮" : err.stack,
  }); // Send Error
}

module.exports = {
    errorHandler,
    notFound
};