const jwt = require('jsonwebtoken');
const user = require('../models/User');
const ErrorResponse = require('../utilities/errorResponse');
const User = require('../models/User');

exports.protect = async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        //Bearer token example: Bearer 42dfgf68dfg2fdg45sdf4s5dsf
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        const user = await User.findById(decoded.id);

        if(!user) {
            return next(new ErrorResponse("No user found with this id", 404));
        }

        req.user = user;

        next();

    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this routes", 401));
    }
}