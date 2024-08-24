const multer = require('multer');
const path = require('path');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const storage = multer.diskStorage({

    // تحديد مجلد تخزين الملفات
    destination: function(req, file, cb) {
        // تحديد المجلد الذي سيتم تخزين الملفات فيه
        cb(null, './uploads/profile'); // يجب التأكد من وجود المجلد أو إنشاؤه مسبقًا
    },

    // تحديد اسم الملف المرفوع
    filename: function(req, file, cb) {
        // إنشاء اسم فريد للملف باستخدام الطابع الزمني ورقم عشوائي
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        // تحديد اسم الملف باستخدام اسم الحقل، اللاحقة الفريدة، والامتداد الأصلي للملف
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        // file.fieldname: اسم الحقل الذي يحتوي على الملف
        // uniqueSuffix: اسم فريد لتجنب تكرار الأسماء
        // path.extname(file.originalname): امتداد الملف الأصلي
    }
});

// إعداد Multer باستخدام إعدادات التخزين المحددة
const upload = multer({ storage: storage });

// تصدير Middleware لتحميل الملفات
module.exports = upload;
