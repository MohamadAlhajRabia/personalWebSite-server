const mongoose = require("mongoose");
const PERSONALINFORMATIONS = require("../dataBases/schemas/personalInformationsSchema");

class PersonalInformation {
  constructor() {}
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START POST PERSONAL INFORMATIONS CONTROLLER ==#
  async postPersonalInformation(personalInformation) {
    try {
      const newPersonalInformation = new PERSONALINFORMATIONS(
        personalInformation
      );
      const savedData = await newPersonalInformation.save(); // حفظ البيانات بدون تمرير بيانات إضافية

      return {
        message: "Personal Information added successfully",
        data: savedData,
      };
    } catch (err) {
      console.error("Error saving personal information:", err); // تحديث الرسالة لتكون دقيقة

      if (err.name === "ValidationError") {
        let errorMessages = Object.values(err.errors).map(
          (error) => error.message
        );
        throw new Error("Validation error: " + errorMessages.join(", "));
      } else {
        throw new Error("Database error: " + err.message);
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== STRAT GET PERSONAL INFRMATIONS CONTROLLER ==#
  async getPersonalInformations() {
    try {
      // استعلام للحصول على الحقول المطلوبة فقط
      const data = await PERSONALINFORMATIONS.find({}, "name email number");

      if (data.length === 0) {
        return { message: "No personal information found." };
      }

      return data;
    } catch (err) {
      console.error("Error fetching personal information:", err);
      return { error: "Error fetching personal information: " + err.message };
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START DELETE PERSONAL INFORMATIONS ==#
  async deletePersonalInformations(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { message: "Invalid ID format" };
      }

      const data = await PERSONALINFORMATIONS.findByIdAndDelete(id);

      if (!data) {
        return { message: "Personal information not found" };
      }

      return { message: "Personal information deleted successfully", data };
    } catch (err) {
      console.error("Error deleting personal information:", err);
      return { error: `Error deleting personal information: ${err.message}` };
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== START UPDATE PERSONAL INFORMATIONS BY ID ==#
  async updatePersonalInformations(personalInformation) {
    try {
      const { _id, name, email, number } = personalInformation;

      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return { error: "Invalid ID format" }; 
      }

      const data = await PERSONALINFORMATIONS.findByIdAndUpdate(
        _id,
        { name, email, number },
        { new: true }
      );

      if (!data) {
        return { error: "Personal information not found" }; 
      }

      return { message: "Personal information updated successfully", data };
    } catch (err) {
      console.error("Error updating personal information:", err);
      return { error: "Error updating personal information: " + err.message };
    }
  }
}

module.exports = PersonalInformation;
