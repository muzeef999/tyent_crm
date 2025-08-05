import mongoose from 'mongoose';
const { Schema } = mongoose;

const serviceSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  visitNo: { type: Number },
  serviceDate: { type: Date },
  nextDueDate: { type: Date },
  notes: { type: String },
  paymentIds: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
  assignedDate: { type: Date },
  closingDate: { type: Date },
  serviceType: [{
    type: String,
    enum: [
      'GENERAL_SERVICE', 'PAID_SERVICE', 'IN_WARRANTY_BREAKDOWN',
      'FILTER_REPLACEMENT', 'INSTALLATION', 'RE_INSTALLATION',
      'FEASIBILITY', 'SPARE_PART_REPLACEMENT', 'DEEP_CLEANING',
      'SPMS_PLUS_REPLACEMENT', 'JOGDIAL_REPLACEMENT', 'DISPLAY_REPLACEMENT'
    ]
  }],
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
}, { timestamps: true });

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;


