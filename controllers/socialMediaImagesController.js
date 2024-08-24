const mongoose = require("mongoose");
const SocialMediaImages = require("../dataBases/schemas/socialMediaSchema");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

class SocialMediaImagesController {
  constructor() {}

  validatorImageUplosd() {
    return [
      body("name").notEmpty().withMessage("The platform name is required"),
      body("platformUrl").notEmpty().withMessage("Platform Link is required"),
      body("fileName").notEmpty().withMessage("File Name is required"),
      body("path").notEmpty().withMessage("Path is required"),
      body("mimeTypes").notEmpty().withMessage("MIME Type is required"),
      body("size").isNumeric().withMessage("Size must be a number"),
    ];
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START ADD  IMAGE CONTROLLER ==#
  async addSocialMediaImage(req, res) {
    try {
      // تحقق من وجود الملف
      if (!req.file) {
        return res.status(400).json({ message: "File is required" });
      }

      // تحقق من البيانات الأخرى في req.body
      const { name, platformUrl, fileName, path, mimeTypes } = req.body;

      if (!name || !platformUrl || !fileName || !path || !mimeTypes) {
        return res.status(400).json({
          message:
            "All fields are required: name, platformUrl, fileName, path, and mimeTypes",
        });
      }

      const socialMediaImagesData = new SocialMediaImages({
        name,
        platformUrl,
        fileName,
        path: req.file.path, // استخدم المسار الذي حصلت عليه من Multer
        mimeTypes: req.file.mimetype, // استخدم نوع MIME من Multer
      });

      await socialMediaImagesData.save();

      res.status(201).json({
        message: "Social Media Image Uploaded Successfully",
        socialMediaImagesData,
      });
    } catch (err) {
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Validation error", error: err.message });
      }
      console.error("Error Saving Social Media Image:", err);
      res
        .status(500)
        .json({ message: "Server error", error: err.message || err });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START GET IMAGE CONTROLLER ==#
  async getAllSocialMediaIMages(req, res) {
    try {
      const data = await SocialMediaImages.find();

      if (data.length === 0) {
        return res
          .status(404)
          .json({ message: "No Social media Images Found " });
      }

      res.status(200).json(data);
    } catch (err) {
      console.error("Error featching Social Media Image:", err);
      res
        .status(500)
        .json({ message: "Server error", error: err.message || err });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // START DELETE IMAGE CONTROLLER
  async deleteSocialMediaImage(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const findSocialImages = await SocialMediaImages.findById(id);

      if (!findSocialImages) {
        return res.status(404).json({
          message: "Profile Image not found",
        });
      }

      await SocialMediaImages.findByIdAndDelete(id);

      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "socialMedia",
        findSocialImages.fileName
      );

      // تحقق من وجود الملف قبل محاولة حذفه
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.warn("File does not exist:", imagePath);
          return;
        }

        // حذف الصورة من نظام الملفات
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      });

      res.status(200).json({
        message: "Profile Image Deleted Successfully",
        data: findSocialImages,
      });
    } catch (err) {
      console.error("Error Delete SocialMedia Image:", err);
      res.status(500).json({
        error: "Delete Image Server Error",
        details: err.message || "An unexpected error occurred",
      });
    }
  }
// START UPDATE IMAGE CONTROLLER
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async updateSocialMediaImage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // التحقق من وجود ملف مرفوع
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }
  
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
  
      const oldImage = await SocialMediaImages.findById(id);
      if (!oldImage) {
        return res.status(404).json({ message: "Profile image not found." });
      }
  
      // حذف الصورة القديمة من السيرفر إذا كانت موجودة
      if (oldImage.path && fs.existsSync(oldImage.path)) {
        try {
          fs.unlinkSync(oldImage.path);
        } catch (error) {
          console.error("Error deleting old profile image:", error);
        }
      }
  
      // تحديث الحقول المطلوبة بدون إنشاء مستند جديد
      oldImage.name = req.body.name || oldImage.name;
      oldImage.platformUrl = req.body.platformUrl || oldImage.platformUrl;
      oldImage.fileName = req.file.filename;
      oldImage.path = req.file.path;
      oldImage.mimeTypes = req.file.mimetype;
  
      await oldImage.save();
  
      res.status(200).json({
        message: "Image updated successfully",
        data: oldImage,
      });
    } catch (err) {
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Error updating Social media image:", err);
      res.status(500).json({ message: "Server error", error: err.message || err });
    }
  }
  
}

module.exports = SocialMediaImagesController;
