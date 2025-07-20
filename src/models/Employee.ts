import mongoose from 'mongoose';
const { Schema } = mongoose;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  contactNumber: { type: String },
  role: { type: String },
  department: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'] },
  joiningDate: { type: Date },
  lastWorkingDate: { type: Date },
  address: { type: String },
  assignedServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }]
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
