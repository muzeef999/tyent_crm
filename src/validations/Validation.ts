// validations/employeeValidation.js
import mongoose from "mongoose";
import { z } from "zod";

export const employeeValidation = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  email: z.string().email(),
  contactNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number format")
    .transform((val) => val.replace(/[^0-9]/g, "")),

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
  aadharNumber: z
    .string()
    .min(12, "Aadhaar number must be 12 digits")
    .regex(/^[2-9]{1}[0-9]{11}$/, "Invalid Aadhaar number format"),

  panNumber: z
    .string()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN number format (e.g., ABCDE1234F)"
    ),
});

export const customerValidation = z
  .object({
    // Required fields with clear error messages for empty values
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(30, { message: "Name must be less than 30 characters" }),

    contactNumber: z
      .string()
      .trim()
      .min(8, { message: "Contact number must be at least 8 digits" })
      .max(15, { message: "Contact number must be less than 15 characters" })
      .regex(/^[0-9+\-\s()]+$/, {
        message:
          "Contact number must contain only numbers and valid phone characters",
      }),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Please provide a valid email address" }),

    address: z
      .string()
      .trim()
      .min(1, { message: "Address is required" })
      .max(500, { message: "Address must be less than 500 characters" }),

    // Optional fields with validation if provided
    invoiceNumber: z
      .string()
      .trim()
      .min(1, { message: "Invoice number cannot be empty" })
      .max(50, { message: "Invoice number must be less than 50 characters" })
      .optional()
      .or(z.literal("")),

    serialNumber: z.string().optional().or(z.literal("")), // Allow empty in form

    warrantyYears: z
      .string()
      .regex(/^\d*\.?\d+$/, {
        message: "Warranty years must be a valid number",
      })
      .optional()
      .or(z.literal("")),

    remarks: z
      .string()
      .trim()
      .max(1000, { message: "Remarks must be less than 1000 characters" })
      .optional()
      .or(z.literal("")),

    tdsValue: z
      .string()
      .regex(/^\d*\.?\d+$/, { message: "TDS value must be a valid number" })
      .optional()
      .or(z.literal("")),

    phValue: z
      .string()
      .regex(/^\d*\.?\d+$/, { message: "pH value must be a valid number" })
      .optional()
      .or(z.literal("")),

    inputWaterFlow: z
      .string()
      .regex(/^\d*\.?\d+$/, {
        message: "Input water flow must be a valid number",
      })
      .optional()
      .or(z.literal("")),

    amcRenewed: z
      .enum(["SERVICE_AMC", "SERVICE_FILTER_AMC", "COMPREHENSIVE_AMC"])
      .optional(),

    // Numeric field with proper validation
    price: z
      .union([
        z.number().nonnegative({ message: "Price must be a positive number" }),
        z.string().transform((val, ctx) => {
          const parsed = parseFloat(val);
          if (isNaN(parsed)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Price must be a valid number",
            });
            return z.NEVER;
          }
          return parsed;
        }),
      ])
      .optional(),

    // Date field with validation
    DOB: z.coerce
      .date()
      .max(new Date(), { message: "Date of birth cannot be in the future" })
      .optional()
      .or(z.literal("")),

    alternativeNumber: z
      .string()
      .trim()
      .min(8, { message: "Alternative number must be at least 8 digits" })
      .max(15, {
        message: "Alternative number must be less than 15 characters",
      })
      .regex(/^[0-9+\-\s()]*$/, {
        message:
          "Alternative number must contain only numbers and valid phone characters",
      })
      .optional()
      .or(z.literal("")),

    // Enum fields with proper error handling
    waterType: z
      .enum(["RO_company", "RO_third-party", "Bore", "Municipal"])
      .optional(),

    waterMethod: z
      .enum([
        "Direct",
        "Booster_company",
        "Booster_third-party",
        "Pressure_company",
        "Pressure_third-party",
      ])
      .optional(),

    // Reference fields with validation
    installedBy: z
      .string()
      .min(1, { message: "Installer reference cannot be empty" })
      .optional()
      .or(z.literal("")),

    marketingManager: z
      .string()
      .min(1, { message: "Marketing manager reference cannot be empty" })
      .optional()
      .or(z.literal("")),

    // Arrays with validation
    payments: z
      .array(z.string().min(1, { message: "Payment ID cannot be empty" }))
      .optional(),

    serviceHistory: z
      .array(
        z.string().min(1, { message: "Service history ID cannot be empty" })
      )
      .optional(),

    upcomingServices: z
      .array(
        z.string().min(1, { message: "Upcoming service ID cannot be empty" })
      )
      .optional(),

    warrantyMachineYears: z
      .string()
      .regex(/^\d*\.?\d+$/, {
        message: "Warranty years must be a valid number",
      })
      .optional()
      .or(z.literal("")),

    warrantyPlatesYears: z
      .string()
      .regex(/^\d*\.?\d+$/, {
        message: "Warranty years must be a valid number",
      })
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // Custom validation: If alternative number is provided, it must be valid
      if (data.alternativeNumber && data.alternativeNumber.trim().length > 0) {
        return data.alternativeNumber.length >= 8;
      }
      return true;
    },
    {
      message: "Alternative number must be at least 8 digits if provided",
      path: ["alternativeNumber"],
    }
  );
