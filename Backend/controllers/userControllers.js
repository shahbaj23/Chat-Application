const httpError = require("../Model/errorModel")
const User = require('../Model/userModel');

const getUsers = async(req, res, next)=>{
    try {
        const loggedInUserId = req.user._id

        const filteredUser = await User.find({_id: { $ne: loggedInUserId}}).select("-password")

        res.status(200).json(filteredUser)
    } catch (error) {
        console.error('Error fetching users:', error.message)
        return next(new httpError("Internal Server Error", 500))
    }
}

module.exports = getUsers