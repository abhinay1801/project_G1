const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    Contract: Number,
    CustItm_Sl: Number,
    Sales_Order: Number,
    Item_Slno: Number,
    Status: String,
    Sales_Order_Date: Date,
    Purchase_Order: String,
    Purchase_Date: Date,
    Division: Number,
    Document_Type: String,
    Sold_To_Party_Name: String,
    City_Of_Supply: String,
    Delivery_Date: Date,
    Original_Delivery_Date: Date,
    LD_Effect: Date,
    Item_LD_Effect: Date,
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
    Scheduled_Delivery_Date: Date,
    Planned_Delivery_Date: Date,
    Project_Short_Text: String,
    Customer_short_TEXT: String
});

const DataModel = mongoose.model("Data", dataSchema);

module.exports = DataModel;
