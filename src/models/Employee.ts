import { number } from 'framer-motion';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  contactNumber: { type: String },
  role: { type: String, enum:[ 'Admin', 'Manager',	'Customer Service',	'Leads Manager', 'Accounts', 'Employee', 'Technician','HR' ] },
  department: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'] },
  joiningDate: { type: Date },
  lastWorkingDate: { type: Date },
  address: { type: String },
  assignedServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }]
}, { timestamps: true });


const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
