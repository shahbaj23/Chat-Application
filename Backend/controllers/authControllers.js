const User = require('../Model/userModel');
const bcrypt = require("bcrypt");
const httpError = require("../Model/errorModel");
const generateTokenAndCookieUtil = require('../utils/generateToken');  // Correct usage of `require`
const generateTokenAndCookie = require('../utils/generateToken');

// ===========Register User===========
// POST = api/user/register
const registerUser = async (req, res, next) => {
    try {
        const { fullname, username, password, confirmPassword, gender, profilePic } = req.body;

        if (password !== confirmPassword) {
            return next(new httpError('Passwords do not match', 400));
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return next(new httpError("Username already exists", 400));
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const boyAvatar = `https://avatar.iran.liara.run/public/boy?${username}`;
        const girlAvatar = `https://avatar.iran.liara.run/public/girl?${username}`;

        const newUser = new User({
            fullname,
            username,
            password: hashPassword,
            gender,
            profilePic: gender === 'male' ? boyAvatar : girlAvatar
        });

        generateTokenAndCookieUtil(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilePic
        });
    } catch (error) {
        next(new httpError('Server error occurred during registration', 500));
    }
};

// =========== Login ===========
const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({username})
        const IsPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!user || !IsPasswordCorrect){
            return next(new httpError("Invalid credentials", 401))
        }

        generateTokenAndCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic
        })
    } catch (error) {
        next(new httpError('Server error occurred during login', 500));
    }

};

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json("Logout successfully.")
    } catch (error) {
        next(new httpError('Server error occurred during logout', 500));
    }
};

module.exports = { registerUser, loginUser, logout };