// handler that takes in a function
// returns a function with 3 input parameters
// this new func responsible for executing the original function
// passing the 3 params, and catching next

// Syntax for taking function as a parameter (that function itself has parameters??)
const asyncHandler = (fn) => (req, res, next) =>
  // next calls error middleware??
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
