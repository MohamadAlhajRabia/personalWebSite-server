const mongoose = require('mongoose');

const profileImageSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: [true, 'File Name Is Required']
    },
    path: {
        type: String,
        required: [true, 'Path Is Required']
    },
    mimeType: {
        type: String,
        required: [true, 'MIME Type Is Required']
    },
    size: {
        type: Number,
        required: [true, 'Size Is Required']
    },
    // تعديل الـ Enum هنا
    mimeTypes: {
        type: String,
        enum: ['image/jpeg', 'image/png', 'image/gif'], // تصحيح قيم enum
        message: 'Invalid MIME Type' // تعديل الرسالة
    }
}, {
    timestamps: { createdAt: 'createdDate' }
});

const ProfileImage = mongoose.model('ProfileImage', profileImageSchema);
module.exports = ProfileImage;
