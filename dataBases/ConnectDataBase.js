const mongoose = require("mongoose");

class ConnectDataBase {
  constructor() {
    this.url = process.env.MONGOBD_URL ||= "mongodb+srv://turkimarzoqipersonal:personalWebSite1234@personalwebsite.jjusl.mongodb.net/?retryWrites=true&w=majority&appName=personalWebSite";
  }

  // #== Start connect method ==#
  connect() {
    mongoose
      .connect(this.url,) // إضافة خيارات لتجنب التحذيرات
      .then(() => {
        console.log("Database is connected successfully.");
      })
      .catch((err) => {
        console.error("There is a problem with connecting to the database:", err);
      });
  }
  // !-- END connect method --!
}

module.exports = ConnectDataBase;
