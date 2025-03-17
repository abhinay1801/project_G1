const express = require("express");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");
const moment = require("moment");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const DataModel = require("./models/DataModel");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const normalizeColumnName = (name) => {
  return name.replace(/\s+/g, "_").replace(/[.]/g, "").trim().toLowerCase();
};

const convertExcelDate = (value) => {
  if (!value || value.toString().trim() === "") return "";
  if (!isNaN(value)) {
    const parsedDate = XLSX.SSF.parse_date_code(value);
    if (parsedDate) {
      return moment(
        new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d)
      ).format("YYYY-MM-DD");
    }
  }
  return moment(value, ["DD.MM.YYYY", "MM/DD/YYYY"], true).format("YYYY-MM-DD");
};

const toDecimal128OrZero = (value) => {
  if (!value || value.toString().trim() === "") {
    return mongoose.Types.Decimal128.fromString("0");
  }

  let cleanedValue = value.toString().replace(/,/g, "").trim();

  try {
    let decimalValue = parseFloat(cleanedValue);
    if (isNaN(decimalValue)) throw new Error("Invalid decimal value");
    return mongoose.Types.Decimal128.fromString(decimalValue.toString());
  } catch (error) {
    console.error(
      "❌ Error converting to Decimal128:",
      error,
      " Value:",
      value
    );
    return mongoose.Types.Decimal128.fromString("0");
  }
};

const toNumberOrZero = (value) => {
  if (!value || value.toString().trim() === "") return 0;
  let cleanedValue = value.toString().replace(/,/g, "").trim();
  let num = parseFloat(cleanedValue);
  return isNaN(num) ? 0 : num;
};

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📂 File received:", req.file.originalname);

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return res
        .status(400)
        .json({ message: "Invalid Excel file, no sheet found" });
    }

    let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
    });

    if (sheetData.length === 0) {
      return res.status(400).json({ message: "Uploaded file is empty" });
    }
    console.log(sheetData);
    sheetData = sheetData.map((row) => {
      let formattedRow = {};
      Object.keys(row).forEach((key) => {
        const normalizedKey = normalizeColumnName(key);
        formattedRow[normalizedKey] = row[key] === undefined ? "" : row[key];
      });

      console.log("🔹 Ordered_Value:", formattedRow["ordered_value"]); // Print original value

      let processedOrderedValue = toNumberOrZero(formattedRow["ordered_value"]);
      console.log("✅ Processed Ordered_Value:", processedOrderedValue); // Print after conversion

      return {
        Contract: toNumberOrZero(formattedRow["contract"]),
        CustItm_Sl: toNumberOrZero(formattedRow["customer_item_slno"]),
        Sales_Order: toNumberOrZero(formattedRow["sales_order"]),
        Item_Slno: toNumberOrZero(formattedRow["item_slno"]),
        Division: toNumberOrZero(formattedRow["division"]),
        Ordered_Qty: toNumberOrZero(formattedRow["ordered_qt"]),
        Item_Price: toDecimal128OrZero(formattedRow["item_price"]?.toString()),
        Ordered_Value: processedOrderedValue, // ✅ Now printed & stored correctly
        Delivered: toNumberOrZero(formattedRow["delivered_price"]),
        Pending_Qty: toNumberOrZero(formattedRow["pending_qt"]),
        Pending_Value: toDecimal128OrZero(
          formattedRow["pend_value"]?.toString()
        ),
        Status: formattedRow["status"] || "",
        Sales_Order_Date: convertExcelDate(formattedRow["sales_order"]),
        Purchase_Order: formattedRow["purchase_order"] || "",
        Purchase_Date: convertExcelDate(formattedRow["purchase_order1"]),
        Document_Type: formattedRow["document_type"] || "",
        Sold_To_Party_Name: formattedRow["sold_to_party_name"] || "",
        City_Of_Supply: formattedRow["city_of_supply"] || "",
        Delivery_Date: convertExcelDate(formattedRow["delivary_date"]),
        Original_Delivery_Date: convertExcelDate(
          formattedRow["original_delivary_date"]
        ),
        LD_Effect: convertExcelDate(formattedRow["ld_effect"]),
        Item_LD_Effect: convertExcelDate(formattedRow["item_ld_ef"]),
        Material_No: formattedRow["material_no"] || "",
        Description: formattedRow["description"] || "",
        Currency: formattedRow["currenry"] || "",
        Industry_Group: formattedRow["industry_g"] || "",
        Inco: formattedRow["inco"] || "",
        Inco_Terms: formattedRow["inco_terms"] || "",
        Project_Description: formattedRow["project_description"] || "",
        Material_Price_Type: formattedRow["material_price_type"] || "",
        Scheduled_Delivery_Date: convertExcelDate(
          formattedRow["scheduled_delivery_date"]
        ),
        Planned_Delivery_Date: convertExcelDate(
          formattedRow["planned_delivery_date"]
        ),
        Project_Short_Text: formattedRow["project_short_text"] || "",
        Customer_Short_Text: formattedRow["customer_short_text"] || "",
      };
    });

    console.log("📊 Data to be stored:", sheetData);

    await DataModel.insertMany(sheetData, { ordered: false })
      .then(() => console.log("✅ Data successfully stored in MongoDB"))
      .catch((error) => console.error("❌ MongoDB Insert Error:", error));

    res.json({ message: "File uploaded successfully", data: sheetData });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
});

app.get("/data", async (req, res) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
