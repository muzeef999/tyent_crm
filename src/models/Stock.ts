import mongoose, { Schema, } from "mongoose";


const StockSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ["NEW_IONIZER", "FILTER_SET", "PRESSURE_TANK", "DEMO_MACHINE", "OLD_STOCK"] },
  modelCode: { type: String },
  stockItems :{ type :String},
  openingStock: { type: Number, default: 0 },
  receivedStock: { type: Number, default: 0 },
  dispatchedStock: { type: Number, default: 0 },
  closingStock: { type: Number, default: 0 },
  location: { type: String },
  remarks: { type: String },
  date: { type: Date, default: Date.now }
  
});

export default mongoose.models.Stock || mongoose.model("Stock", StockSchema);