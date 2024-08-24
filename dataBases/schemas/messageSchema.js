const mongoose = require('mongoose');

// إنشاء دالة تحقق من صحة البريد الإلكتروني
const emailValidator = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const messageSchema = mongoose.Schema({
    SenderName: { 
        type: String, 
        required: [true, 'your name is required'], 
        trim: true, 
        maxlength: [100, 'your name cannot exceed 100 characters'] 
    },
    title: { 
        type: String, 
        required: [true, 'your title is required'], 
        trim: true, 
       },
    senderEmail: { 
        type: String, 
        required: [true, 'your email is required'], 
        trim: true, 
        lowercase: true, 
        validate: {
            validator: emailValidator,
            message: 'Invalid email format'
        } 
    },
    messageContent: { 
        type: String, 
        required: [true, 'Message content is required'], 
        trim: true,
        maxlength: [1000, 'Message content cannot exceed 1000 characters'] 
    },
}, 
{
    timestamps: { createdAt: 'createdDate' }
});

module.exports = mongoose.model('MESSAGE', messageSchema);
