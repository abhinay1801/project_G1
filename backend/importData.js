const mongoose = require("mongoose");
const XLSX = require("xlsx");
const DataModel = require("./models/DataModel");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();

async function importExcel() {
    const workbook = XLSX.readFile(__dirname + "/Dashboard1.xlsx");
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    await DataModel.insertMany(sheet);
    console.log("Data imported successfully");
    mongoose.connection.close();
}

importExcel().catch(err => console.log(err));