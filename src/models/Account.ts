import mongoose from 'mongoose';
const { Schema } = mongoose;

const accountSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  paymentIds: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
  dueAmount: { type: Number },
  paymentStatus: { type: String }, // PAID / PENDING / PARTIALLY
}, { timestamps: true });

export default mongoose.model('Account', accountSchema);
