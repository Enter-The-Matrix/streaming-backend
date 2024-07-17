class ApiError extends Error {
  constructor(
    statusCode, // HTTP status code
    message = "Something went wrong", // Error message (default: "Something went wrong")
    errors = [], // Array of errors (default: empty array)
    stack = "" // Optional stack trace
  ) {
    super(message); // Call the parent class constructor (Error) with the message
    this.statusCode = statusCode; // Set the status code
    this.data = null; // Initialize data to null (not used further in the constructor)
    this.message = message; // Set the error message
    this.success = false; // Indicate that the operation was not successful
    this.errors = errors; // Set the array of errors

    // Set the stack trace if provided, otherwise capture it from the current context
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
