const mongoose = require("mongoose");
const MESSAGE = require("../dataBases/schemas/messageSchema");

class messagesController {
  constructor() {
   
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== Start POST All Messages ==#
  async postMessage(message) {
    try {
      const newMessage = new MESSAGE(message);
      const data = await newMessage.save();
      return { message: "Message Added successfully", data };
    } catch (err) {
      console.error("Error saving message:", err);

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
  // #== Start get All Messages ==#
  async getAllMessages() {
    try {
      const data = await MESSAGE.find(
        {},
        "SenderName senderEmail title messageContent createdDate"
      );
      if (data.length === 0) {
        return { message: "There are no messages" };
      } else {
        return data;
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      return { error: "Error fetching messages: " + err.message };
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== Start Delete Message By ID ==#
  async deleteMessage(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { message: "Invalid ID format" };
      }

      const data = await MESSAGE.findByIdAndDelete(id);

      if (!data) {
        return { message: "Message with this ID does not exist" };
      }

      return { message: "Message deleted successfully", data };
    } catch (err) {
      console.error("Error deleting message:", err);
      return { error: "Error deleting message: " + err.message };
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // #== Start Get Message By ID ==#
  async getMessageById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { message: "Invalid ID format" };
      }

      const data = await MESSAGE.findById(id);

      if (!data) {
        return { message: "Message with this ID does not exist" };
      }

      return { message: "Message found successfully", data };
    } catch (err) {
      console.error("Error retrieving message:", err);
      return { error: "Error retrieving message: " + err.message };
    }
  }
}

module.exports = messagesController;
