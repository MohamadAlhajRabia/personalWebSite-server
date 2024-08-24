// في ملف إعداد Multer (مثل: upload.js)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const uploadDir = './uploads/socialMedia';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadSocialMedia = multer({ storage: storage });

module.exports = uploadSocialMedia;
