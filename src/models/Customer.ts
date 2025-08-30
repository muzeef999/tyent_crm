import mongoose from "mongoose";
const { Schema, Types } = mongoose;

// Define interface for validator props
interface ValidatorProps {
  value: any;
  path: string;
}

const customerSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxLength: 100
    },
    contactNumber: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v: string): boolean {
          // More flexible Indian phone number validation
          return /^[6-9]\d{9}$/.test(v.replace(/\D/g, '')); // Remove non-digits before testing
        },
        message: (props: ValidatorProps) => `${props.value} is not a valid Indian phone number!`
      }
    },
    alternativeNumber: { 
      type: String,
      validate: {
        validator: function(v: string): boolean {
          return v === "" || /^[6-9]\d{9}$/.test(v.replace(/\D/g, ''));
        },
        message: (props: ValidatorProps) => `${props.value} is not a valid Indian phone number!`
      }
    },
    email: { 
      type: String,
      lowercase: true,
      validate: {
        validator: function(v: string): boolean {
          return v === "" || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props: ValidatorProps) => `${props.value} is not a valid email!`
      }
    },
    address: { 
      type: String,
      maxLength: 500
    },
    price: { 
      type: Number, 
      required: true,
      min: 0
    },
    payments: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Payment" 
    }],
    invoiceNumber: { 
      type: String, 
      required: true,
      unique: true // Ensure invoice numbers are unique
    },
    serialNumber: { 
      type: String, 
      ref: "Product",
      required: true
    },
    state: { 
      type: String,
      required: true
    },
    city: { 
      type: String,
      required: true
    },
    warrantyYears: { 
      type: String,
      enum: ["1", "2", "3", "4", "5"],
      default: "1"
    },
    amcRenewed: {
      type: String,
      enum: ["SERVICE_AMC", "SERVICE_FILTER_AMC", "COMPREHENSIVE_AMC", null],
      default: null
    },
    serviceHistory: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Service" 
    }],
    upcomingServices: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Service" 
    }],
    remarks: { 
      type: String,
      maxLength: 1000
    },
    DOB: { 
      type: Date,
      validate: {
        validator: function(v: Date): boolean {
          return v === null || v < new Date();
        },
        message: "Date of birth must be in the past"
      }
    },
    installedBy: { 
      type: Schema.Types.ObjectId, 
      ref: "Employee",
      required: true
    },
    marketingManager: { 
      type: Schema.Types.ObjectId, 
      ref: "Employee",
      required: true
    },
    waterType: {
      type: String,
      enum: ["RO_company", "RO_third-party", "Bore", "Municipal"],
      required: true
    },
    waterMethod: {
      type: String,
      enum: [
        "Direct",
        "Booster_company",
        "Booster_third-party",
        "Pressure_company",
        "Pressure_third-party",
      ],
      required: true
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Add index for better query performance
customerSchema.index({ contactNumber: 1 }, { unique: true });
customerSchema.index({ email: 1 }, { sparse: true });
customerSchema.index({ invoiceNumber: 1 }, { unique: true });
customerSchema.index({ serialNumber: 1 });
customerSchema.index({ city: 1, state: 1 });

export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);