export const catchAsyncError = (theFunction) => (req, res, next) =>
    Promise.resolve(theFunction(req, res, next)).catch(next);
