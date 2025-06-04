const globalErrorHandle = (err, req, res, next) => {
    console.log(err.stack);

    const stack = err.stack;
    const message = err.message;
    const status = err.status || "failed";
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message,
        status,       
        stack,
    });
}


module.exports = globalErrorHandle;