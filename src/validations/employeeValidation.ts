// validations/employeeValidation.js
import { z } from "zod";

export const employeeValidation = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  contactNumber: z.string()
  .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number format")
  .transform((val) => val.replace(/[^0-9]/g, '')) ,

  designation: z
    .enum([
      "Admin",
      "Super Admin",
      "Marketing Manager",
      "Technical Manager",
      "Telecall Manager",
      "Stock Manager",
      "Account Manager",
      "Technician",
      "Telecaller",
      "Stock Clerk",
      "Accountant",
      "Customer Support",
      "Intern",
      "HR Executive",
      "Sales Executive",
    ])
    .optional(),
    
  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]).optional(),

  joiningDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"), // required
  
    lastWorkingDate: z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
  .optional()
  .or(z.literal("")), // allow empty string

  address: z.string(),
  assignedServices: z.array(z.string()).optional(),
  aadharNumber: z.string().regex(/^[2-9]{1}[0-9]{11}$/),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
});
