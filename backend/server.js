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

// Function to normalize column names
const normalizeColumnName = (name) => {
    return name.replace(/\s+/g, "_").replace(/[.]/g, "").trim().toLowerCase();
};

// Function to convert date fields properly
const convertExcelDate = (dateString) => {
    if (!dateString || dateString.toString().trim() === "") return null;
    const parsedDate = moment(dateString, ["DD.MM.YYYY", "MM/DD/YYYY"], true);
    return parsedDate.isValid() ? parsedDate.toDate() : null;
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

        let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

        if (sheetData.length === 0) {
            return res.status(400).json({ message: "Uploaded file is empty" });
        }

        // Normalize column names and map data properly
        sheetData = sheetData.map(row => {
            let formattedRow = {};
            Object.keys(row).forEach(key => {
                const normalizedKey = normalizeColumnName(key);
                formattedRow[normalizedKey] = row[key] === undefined ? "" : row[key];
            });
            // Dynamically find and parse Contract field correctly
            const contractKey = Object.keys(formattedRow).find(key => key.includes("contract"));

            let contractValue = null;
            if (contractKey && formattedRow[contractKey] !== "") {
                let rawValue = formattedRow[contractKey].toString().replace(/,/g, "").trim();
                contractValue = !isNaN(rawValue) ? Number(rawValue) : null;
            }

            // Debugging log to check contract value extraction
            console.log(`Extracted Contract Value: ${contractValue}`);

            return {
                Contract: contractValue,
                CustItm_Sl: formattedRow["custitm_sl"] ? Number(formattedRow["custitm_sl"]) : null,
                Sales_Order: formattedRow["sales_orde"] ? Number(formattedRow["sales_orde"]) : null,
                Item_Slno: formattedRow["item_slno"] ? Number(formattedRow["item_slno"]) : null,
                Status: formattedRow["status"] || "",
                Sales_Order_Date: convertExcelDate(formattedRow["sales_orde_1"]),
                Purchase_Order: formattedRow["purchase_o"] || "",
                Purchase_Date: convertExcelDate(formattedRow["purchase_o_1"]),
                Division: formattedRow["division"] ? Number(formattedRow["division"]) : null,
                Document_Type: formattedRow["document_t"] || "",
                Sold_To_Party_Name: formattedRow["sold_to_party_name"] || "",
                City_Of_Supply: formattedRow["city_of_su"] || "",
                Delivery_Date: convertExcelDate(formattedRow["delvy_date"]),
                Original_Delivery_Date: convertExcelDate(formattedRow["orig_delv"]),
                LD_Effect: convertExcelDate(formattedRow["ld_effect"]),
                Item_LD_Effect: convertExcelDate(formattedRow["item_ld_ef"]),
                Material_No: formattedRow["material_no"] || "",
                Description: formattedRow["description"] || "",
                Ordered_Qty: formattedRow["ordered_qt"] ? Number(formattedRow["ordered_qt"]) : null,
                Item_Price: formattedRow["item_price"] ? Number(formattedRow["item_price"]) : null,
                Ordered_Value: formattedRow["ordered_va"] ? Number(formattedRow["ordered_va"]) : null,
                Delivered: formattedRow["delivered"] ? Number(formattedRow["delivered"]) : 0,
                Pending_Qty: formattedRow["pending_qt"] ? Number(formattedRow["pending_qt"]) : null,
                Pending_Value: formattedRow["pend_value"] ? Number(formattedRow["pend_value"]) : null,
                Currency: formattedRow["curr"] || "",
                Industry_Group: formattedRow["industry_g"] || "",
                Inco: formattedRow["inco"] || "",
                Inco_Terms: formattedRow["inco_terms"] || "",
                Project_Description: formattedRow["project_description"] || "",
                Material_Price_Type: formattedRow["material_price_type"] || "",
                Scheduled_Delivery_Date: convertExcelDate(formattedRow["scheduled_delivery_date"]),
                Planned_Delivery_Date: convertExcelDate(formattedRow["planned_delivery_date"]),
                Project_Short_Text: formattedRow["project_short_text"] || "",
                Customer_short_TEXT: formattedRow["customer_short_text"] || ""
            };
        });

        console.log("📊 Data to be stored:", sheetData);

        await DataModel.insertMany(sheetData, { ordered: false })
            .then(() => console.log("✅ Data successfully stored in MongoDB"))
            .catch(error => console.error("❌ MongoDB Insert Error:", error));

        res.json({ message: "File uploaded successfully", data: sheetData });
    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).json({ message: "Error uploading file", error: error.message });
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

