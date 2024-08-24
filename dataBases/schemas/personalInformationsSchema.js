const mongoose = require('mongoose');

// دالة تحقق من صحة البريد الإلكتروني
const emailValidator = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const personalInformationSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
        
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        validate: {
            validator: emailValidator,
            message: 'Invalid email format'
        }
    },
    number: {
        type: String,
        required: [true, 'Number is required'],
        trim: true
    },   
}, {
    timestamps: true // ينشئ حقول createdAt و updatedAt بشكل افتراضي
});

module.exports = mongoose.model('PersonalInformation', personalInformationSchema);
