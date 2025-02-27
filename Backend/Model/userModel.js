const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    fullname: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    gender: {type: String, required: true, enum: ["male", "female"]},
    profilePic: {type: String, default: ""}
}, {timestamps: true});


module.exports = model('User', userSchema)