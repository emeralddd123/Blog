const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    timestamp: {
        type: Date,
        default: Date.now,
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});


const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
