const ErrorResponse = require("../utilities/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = {...err};

    error.message = err.message;

    if(err.code ===11000) {
        const message = 'Duplicate Field Value Enter';
        error = new ErrorResponse(message, 400);
    }

    if(err.code ==='Validation Error') {
        const message = Object.values(err.errors).map((val) => val.message);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        eroor: error.message || "Server Error"
    });
};

module.exports = errorHandler;