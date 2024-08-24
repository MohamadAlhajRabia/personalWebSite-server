const mongoose = require('mongoose');
const validator = require('validator');

const socialMediaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "The platform name is required"],
        trim: true
    },
    platformUrl: {
        type: String,
        required: [true, 'Platform Link is required'],
        trim: true,
        match: [/^https?:\/\/[^\s/$.?#].[^\s]*$/, 'Invalid URL']  
    },
    fileName: {
        required: [true, 'File Name is required'],
        type: String,
    },
    path: {
        required: [true, 'Path is required'],
        type: String,
    },
    mimeTypes: {
        type: String,
        required: [true, 'MIME Type is required'],
        enum: ['image/png', 'image/jpeg', 'image/gif'],
        message: 'Invalid MIME Type'
    },
}, {
    timestamps: { createdAt: 'createdDate' }
});

const socialMediaImages = mongoose.model('SocialMediaImages', socialMediaSchema);

module.exports = socialMediaImages;
