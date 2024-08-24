const mongoose = require('mongoose');

// تعريف Schema للنموذج
const textsSchema = new mongoose.Schema({
    about: {
        type: String,
        trim: true,
       
    },
    moreDetails: {
        type: String,
        trim: true,
       
    }
}, {
    timestamps: true // إضافة الطوابع الزمنية للإنشاء والتحديث
});

// تصدير النموذج
module.exports = mongoose.model('Text', textsSchema);
