// backend/server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");
const moment = require("moment");
const connectDB = require("./config/db");
const DataModel = require("./models/DataModel");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to convert "DD.MM.YYYY" or "MM/DD/YYYY" to ISO Date
const convertExcelDate = (dateString) => {
    if (!dateString || dateString.toString().trim() === "") return ""; // Keep empty if no date
    const parsedDate = moment(dateString, ["DD.MM.YYYY", "MM/DD/YYYY"], true);
    return parsedDate.isValid() ? parsedDate.toISOString() : "";
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
            return res.status(400).json({ message: "Invalid Excel file, no sheet found" });
        }

        // Read Excel data with defval: "" to avoid missing fields
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

        if (sheetData.length === 0) {
            return res.status(400).json({ message: "Uploaded file is empty" });
        }

        // ✅ Define expected schema fields
        const schemaFields = [
            "Contract", "CustItm_Sl", "Sales_Order", "Item_Slno", "Status", "Sales_Order_Date",
            "Purchase_Order", "Purchase_Date", "Division", "Document_Type", "Sold_To_Party_Name",
            "City_Of_Supply", "Delivery_Date", "Original_Delivery_Date", "LD_Effect", "Item_LD_Effect",
            "Material_No", "Description", "Ordered_Qty", "Item_Price", "Ordered_Value", "Delivered",
            "Pending_Qty", "Pending_Value", "Currency", "Industry_Group", "Inco", "Inco_Terms",
            "Project_Description", "Material_Price_Type", "Scheduled_Delivery_Date", "Planned_Delivery_Date",
            "Project_Short_Text", "Customer_short_TEXT"
        ];

        // 🛠 Normalize and clean data before inserting
        const formattedData = sheetData.map(row => {
            const cleanedRow = {};

            schemaFields.forEach(field => {
                // Find the exact column in Excel that matches the field
                const excelKey = Object.keys(row).find(key => {
                    // Normalize both the Excel column name and schema field
                    const normalizedKey = key.replace(/\s+/g, "_").replace(/[^\w]/g, "").trim().toLowerCase();
                    const normalizedField = field.replace(/\s+/g, "_").replace(/[^\w]/g, "").trim().toLowerCase();
                    return normalizedKey === normalizedField;
                });
                

                let value = excelKey ? row[excelKey] : "";

                // Convert Date Fields properly
                if (["Sales_Order_Date", "Purchase_Date", "Delivery_Date", "Original_Delivery_Date",
                     "LD_Effect", "Item_LD_Effect", "Scheduled_Delivery_Date", "Planned_Delivery_Date"].includes(field)) {
                    cleanedRow[field] = convertExcelDate(value);
                } else if (typeof value === "number") {
                    cleanedRow[field] = value;
                } else {
                    cleanedRow[field] = value !== "" ? value.toString().trim() : ""; // Store empty string if missing
                }
            });

            return cleanedRow;
        });

        console.log("📊 Formatted Data:", formattedData);

        // ✅ Store data in MongoDB ensuring all fields are included
        await DataModel.insertMany(formattedData, { ordered: false })
            .then(() => console.log("✅ Data successfully stored in MongoDB"))
            .catch(error => console.error("❌ MongoDB Insert Error:", error));

        res.json({ message: "File uploaded successfully", data: formattedData });
    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).json({ message: "Error uploading file", error: error.message });
    }
});

// 📌 Fetch all stored data
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
