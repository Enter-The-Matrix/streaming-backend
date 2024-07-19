
// const asyncHandler =  (function) => {
//     async () => {
//     }
// }

// above function represent same as below
// const asyncHandler = (func) => async () => {}



// using try catch    
// const asyncHandler = (func) => async (req, res, next) => {

//     try {
//         await func(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

// code used in the tutorial
// const asyncHandler = (requestHandler) => {
//    return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next))
//             .catch((err) => next(err))
//     }
// }

// export { asyncHandler } 


// mine code
const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            // Await the execution of the request handler
            await requestHandler(req, res, next);
        } catch (err) {
            // Pass any errors to the next middleware
            next(err);
        }
    };
};

export { asyncHandler };
