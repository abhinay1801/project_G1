const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    Contract: Number,
    CustItm_Sl: Number,
    Sales_Order: Number,
    Item_Slno: Number,
    Status: String,
    Sales_Order_Date: String,
    Purchase_Order: String,
    Purchase_Date: String,
    Division: Number,
    Document_Type: String,
    Sold_To_Party_Name: String,
    City_Of_Supply: String,
    Delivery_Date: String,
    Original_Delivery_Date: String,
    LD_Effect: String,
    Item_LD_Effect: String,
    Material_No: String,
    Description: String,
    Ordered_Qty: Number,
    Item_Price: Number,
    Ordered_Value: Number,
    Delivered: Number,
    Pending_Qty: Number,
    Pending_Value: Number,
    Currency: String,
    Industry_Group: String,
    Inco: String,
    Inco_Terms: String,
    Project_Description: String,
    Material_Price_Type: String,
    Scheduled_Delivery_Date: String,
    Planned_Delivery_Date: String,
    Project_Short_Text: String,
    Customer_Short_Text: String
});

const DataModel = mongoose.model("Data", dataSchema);

module.exports = DataModel;




























// const mongoose = require("mongoose");

// const dataSchema = new mongoose.Schema({
//     Contract: mongoose.Schema.Types.Decimal128,
//     CustItm_Sl: mongoose.Schema.Types.Decimal128,
//     Sales_Order: mongoose.Schema.Types.Decimal128,
//     Item_Slno: mongoose.Schema.Types.Decimal128,
//     Status: String,
//     Sales_Order_Date: Date,
//     Purchase_Order: String,
//     Purchase_Date: Date,
//     Division: mongoose.Schema.Types.Decimal128,
//     Document_Type: String,
//     Sold_To_Party_Name: String,
//     City_Of_Supply: String,
//     Delivery_Date: Date,
//     Original_Delivery_Date: Date,
//     LD_Effect: Date,
//     Item_LD_Effect: Date,
//     Material_No: mongoose.Schema.Types.Decimal128,
//     Description: String,
//     Ordered_Qty: mongoose.Schema.Types.Decimal128,
//     Item_Price: mongoose.Schema.Types.Decimal128,
//     Ordered_Value: mongoose.Schema.Types.Decimal128,
//     Delivered: mongoose.Schema.Types.Decimal128,
//     Pending_Qty: mongoose.Schema.Types.Decimal128,
//     Pending_Value: mongoose.Schema.Types.Decimal128,
//     Currency: String,
//     Industry_Group: String,
//     Inco: String,
//     Inco_Terms: String,
//     Project_Description: String,
//     Material_Price_Type: String,
//     Scheduled_Delivery_Date: Date,
//     Planned_Delivery_Date: Date,
//     Project_Short_Text: String,
//     Customer_short_TEXT: String
// });

// const DataModel = mongoose.model("Data", dataSchema);

// module.exports = DataModel;
