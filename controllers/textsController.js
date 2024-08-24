const TEXTS = require("../dataBases/schemas/textsSchema");

class TextsController {
  constructor() {}

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #==START ADD TEXTS CONTROLLER ==#
  async addTexts(texts) {
    try {
      // التحقق من صحة البيانات قبل حفظها
      if (!texts.about && !texts.moreDetails) {
        throw new Error(
          'At least one of the fields "about" or "moreDetails" must be provided.'
        );
      }

      const newText = new TEXTS(texts);
      const data = await newText.save();

      return { message: "Texts Added Successfully", data };
    } catch (err) {
      console.error("Error Saving Texts:", err); // استخدام console.error بدلاً من console.log
      return { error: `Error Saving Texts: ${err.message}` }; // تحسين رسالة الخطأ
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START GET TEXTS CONTROLLER ==#
  async getAllTexts() {
    try {
      const data = await TEXTS.find();

      if (data.length === 0) {
        return { message: "No texts found." }; // رسالة توضح عدم وجود بيانات
      }

      return data;
    } catch (err) {
      console.error("Error fetching texts:", err); // تصحيح الكتابة واستخدام console.error بدلاً من console.log
      return { error: `Error fetching texts: ${err.message}` }; // تحسين رسالة الخطأ
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START UPDATE TEXTS CONTROLLER --!
  async updateTexts(id, updatedTexts) {
    try {
      // التحقق من وجود بيانات كافية
      if (!updatedTexts.about && !updatedTexts.moreDetails) {
        throw new Error(
          'At least one of the fields "about" or "moreDetails" must be provided.'
        );
      }

      // تحديث النصوص باستخدام findByIdAndUpdate
      const data = await TEXTS.findByIdAndUpdate(id, updatedTexts, {
        new: true,
      });

      if (!data) {
        return { message: "No texts to update found." };
      }

      return {
        message: "Texts Updated Successfully",
        data,
      };
    } catch (err) {
      console.error("Error updating texts:", err);
      return { error: `Error updating texts: ${err.message}` };
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START DELETE TEXTS CONTROLLER ==#

  async deleteText(id) {
    try {
      // التحقق من وجود المعرف
      if (!id) {
        return {
          message: "ID is required",
        };
      }

      // حذف النصوص باستخدام findByIdAndDelete
      const data = await TEXTS.findByIdAndDelete(id);

      // التحقق مما إذا تم العثور على النصوص
      if (!data) {
        return {
          message: "No Texts found to delete",
        };
      }

      return {
        message: "Text deleted successfully",
        data,
      };
    } catch (err) {
      console.error("Error deleting texts:", err);
      return {
        error: "Error deleting text: " + err.message,
      };
    }
  }
}

module.exports = TextsController;
