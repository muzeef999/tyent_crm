import mongoose from 'mongoose';
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  installedModel: { type: String, enum: ['NMP-5', 'NMP-7', 'NMP-9', 'NMP-11', 'UCE-9', 'UCE-11', 'UCE-13', 'Hbride-H2', 'H-rich'] },
  price: { type: Number },
  payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
  invoiceNumber: { type: String },
  serialNumber: { type: String },
  warrantyYears: { type: String },
  amcRenewed: { type: String, enum:["YES", "NO"] },
  serviceHistory: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  upcomingServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  remarks: { type: String },
  DOB: { type: Date },
  installedBy: { type: Schema.Types.ObjectId, ref:'Employee' },
  marketingManager: { type: Schema.Types.ObjectId, ref:'Employee' },
  R0: { type: Boolean },
  pressureTank: { type: Boolean },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);
