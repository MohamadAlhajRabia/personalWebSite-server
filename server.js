const moment = require("moment");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const path = require('path');



// CONNECTING TO DATABAS
const CONNECTDATABASE = require("./dataBases/ConnectDataBase");
const connect = new CONNECTDATABASE();

//ROUTES 
const adminRoutes = require("./routes/adminRoutes");
const homeRoutes = require('./routes/homeRotes')

// إعداد مسار تحميل الملفات الثابتة
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // تأكد من وجود مجلد uploads

app.use("/admin", adminRoutes);
app.use('/home',homeRoutes)



// #== Start Listen fun ==#
const port = process.env.PORT|| 3002;
app.listen(port, () => {
  console.log(`Server working on port: ${port}`);
  connect.connect(); // التأكد من الاتصال بقاعدة البيانات عند بدء تشغيل السيرفر
});
// #== END Listen fun ==#
