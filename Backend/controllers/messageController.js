const mongoose = require('mongoose');
const Conversation = require("../Model/conversationModel");
const httpError = require("../Model/errorModel");
const Message = require("../Model/messageModel");

const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) {
            return next(new httpError("Message content is required", 400));
        }

        const { id: receiveId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiveId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiveId]
            });
        }

        const newMessage = new Message({ senderId, receiveId, message });
        // await newMessage.save(); 

        conversation.messages.push(newMessage._id);
        // await conversation.save(); 

        Promise.all([newMessage.save(), conversation.save()])

        res.status(201).json({ message: "Message sent successfully.", data: newMessage });
    } catch (error) {
        console.error('Error in sendMessage:', error); 
        return next(new httpError("Internal Server Error", 500));
    }
};

const getMessages = async (req, res, next)=>{
    try {
        const {id: userToChat} = req.params;
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
            participants: [senderId, userToChat]
        }).populate("messages")

        if(!conversation){
            return res.status(200).json([])
        }

        res.status(200).json(conversation.messages)
    } catch (error) {
        console.error('Error in sendMessage:', error); 
        return next(new httpError("Internal Server Error", 500));
    }
}

module.exports = { sendMessage, getMessages };
