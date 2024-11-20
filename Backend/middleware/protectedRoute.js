const jwt = require('jsonwebtoken');
const httpError = require('../Model/errorModel');
const User = require('../Model/userModel');

const protectedRoute = async (req, res, next) => {
    try {
        // Ensure cookies are being parsed
        const token = req.cookies?.jwt; // Safely access 'jwt' to prevent errors if 'req.cookies' is undefined

        if (!token) { // Corrected the condition to check if the token is missing
            return next(new httpError("Unauthorized, No token", 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new httpError("Unauthorized, Invalid token", 401));
        }

        const user = await User.findById(decoded.userId).select('-password'); 
        
        if (!user) {
            return next(new httpError("User not found", 404));
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        return next(new httpError("Internal Server Error", 500));
    }
};

module.exports = protectedRoute;
