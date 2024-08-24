const { body, validationResult } = require("express-validator");
const ProfileImage = require("../dataBases/schemas/profileImageSchema");
const fs = require("fs");
const { error } = require("console");
const mongoose = require("mongoose");
const path = require("path");

class ProfileImageController {
  constructor() {}

  validateImageUpload() {
    return [
      body("fileName").notEmpty().withMessage("File Name is required"),
      body("path").notEmpty().withMessage("Path is required"),
      body("mimeType").notEmpty().withMessage("MIME Type is required"),
      body("size").isNumeric().withMessage("Size must be a number"),
    ];
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START POST IMAGE CONTROLLER ==#
  async uploadImage(req, res) {
    try {
      // التحقق من وجود خطأ في عملية التحقق من الصحة
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // التحقق من وجود ملف مرفوع
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const { filename, path, mimetype, size } = req.file;

      // التحقق من وجود الحقول المطلوبة
      if (!filename || !path || !mimetype || !size) {
        return res.status(400).json({
          message:
            "All fields are required: filename, path, mimetype, and size",
        });
      }

      // إنشاء كائن جديد من ProfileImage
      const newProfileImage = new ProfileImage({
        fileName: filename,
        path: path,
        mimeType: mimetype,
        size: size,
      });

      // حفظ الصورة في قاعدة البيانات
      await newProfileImage.save();

      // استجابة ناجحة
      res.status(201).json({
        message: "Image Added Successfully",
        profileImage: newProfileImage,
      });
    } catch (err) {
      // حذف الملف في حالة حدوث خطأ
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Error Saving ProfileImage:", err);
      res
        .status(500)
        .json({ message: "Server error", error: err.message || err });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START GET ALL PROFILE IMAGES ==#
  async getProfileImages(req, res) {
    try {
      // استرجاع جميع صور البروفايل من قاعدة البيانات
      const data = await ProfileImage.find();

      if (data.length === 0) {
        return res.status(404).json({ message: "No profile images found" });
      }

      // إرسال الصور بنجاح
      res.status(200).json(data);
    } catch (err) {
      // تسجيل الخطأ في وحدة التحكم
      console.error("Error fetching ProfileImages:", err);

      // إرسال استجابة تحتوي على معلومات عن الخطأ
      res.status(500).json({
        message: "Get IMAGE Server error",
        error: err.message || "An unexpected error occurred",
      });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START GET ALL PROFILE IMAGES --!
  async deleteProfileImage(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      // العثور على الصورة في قاعدة البيانات
      const findProfileImage = await ProfileImage.findById(id);

      if (!findProfileImage) {
        return res.status(404).json({ message: "Profile Image not found" });
      }

      // حذف الصورة من قاعدة البيانات
      await ProfileImage.findByIdAndDelete(id);

      // تحديد مسار الصورة
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "profile",
        findProfileImage.fileName
      );

      // تحقق من وجود الملف قبل محاولة حذفه
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.warn("File does not exist:", imagePath);
          // يمكن معالجة عدم وجود الملف هنا، لكن لا تؤثر على استجابة العميل
          return;
        }

        // حذف الصورة من نظام الملفات
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            // يمكن معالجة خطأ الحذف هنا، ولكن لا تؤثر على استجابة العميل
          }
        });
      });

      res.status(200).json({
        message: "Profile Image Deleted Successfully",
        data: findProfileImage,
      });
    } catch (err) {
      console.error("Error Delete Profile Image:", err);
      res.status(500).json({
        error: "Delete Image Server Error",
        details: err.message || "An unexpected error occurred",
      });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START UPDATE ALL PROFILE IMAGES --!
  async updateProfileImage(req, res) {
    try {
      // التحقق من وجود أي أخطاء في الطلب
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // التحقق من وجود ملف مرفوع
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const { filename, path, mimetype, size } = req.file;
      if (!filename || !path || !mimetype || !size) {
        return res.status(400).json({
          message:
            "All fields are required: filename, path, mimetype, and size",
        });
      }

      const id = req.params.id; // أو من مكان آخر حسب الطريقة التي تستخدمها في طلبك

      if (!id) {
        return res
          .status(400)
          .json({ message: "ID is required for updating the profile image." });
      }

      // العثور على صورة الملف الشخصي القديمة
      const oldProfileImage = await ProfileImage.findById(id);
      if (!oldProfileImage) {
        return res.status(404).json({ message: "Profile image not found." });
      }

      // حذف الصورة القديمة من الخادم
      if (oldProfileImage.path) {
        try {
          fs.unlinkSync(oldProfileImage.path);
        } catch (error) {
          console.error("Error deleting old profile image:", error);
          // متابعة عملية التحديث حتى لو فشل حذف الصورة القديمة
        }
      }

      // تحديث صورة الملف الشخصي في قاعدة البيانات
      const updatedProfileImage = await ProfileImage.findByIdAndUpdate(
        id,
        { fileName: filename, path: path, mimeType: mimetype, size: size },
        { new: true }
      );

      if (!updatedProfileImage) {
        return res.status(404).json({ message: "Profile image not found." });
      }

      res.status(200).json({
        message: "Image updated successfully",
        profileImage: updatedProfileImage,
      });
    } catch (err) {
      // حذف الصورة الجديدة إذا كان هناك خطأ
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Error updating profile image:", err);
      res
        .status(500)
        .json({ message: "Server error", error: err.message || err });
    }
  }
}

module.exports = ProfileImageController;
