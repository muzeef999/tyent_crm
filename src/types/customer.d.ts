export interface Customer {
  _id?: string;
  name: string;
  contactNumber: string;
  email?: string;
  address?: string;
  installedModel?: MachineModel;
  price?: number;
  payments?: string[];
  invoiceNumber?: string;
  serialNumber?: string;
  warrantyYears?: string;
  amcRenewed?: string;
  serviceHistory?: string[];
  upcomingServices?: string[];
  remarks?: string;
  DOB?: string;
  installedBy?: string | Employee;
  marketingManager?: string | Employee;
  R0?: boolean;
  pressureTank?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Account {
  _id?: Types.ObjectId;
  customerId: Types.ObjectId;
  paymentIds?: Types.ObjectId[];
  dueAmount?: number;
  paymentStatus?: "PAID" | "PENDING" | "PARTIALLY";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Employee {
  _id?: Types.ObjectId;
  name: string;
  email?: string;
  contactNumber?: string;
  designation?:
    | "Admin"
    | "Super Admin"
    | "Marketing Manager"
    | "Technical Manager"
    | "Telecall Manager"
    | "Stock Manager"
    | "Account Manager"
    | "Technician"
    | "Telecaller"
    | "Stock Clerk"
    | "Accountant"
    | "Customer Support"
    | "Intern"
    | "HR Executive"
    | "Sales Executive"
    | "";
  panNumber?: string;
  aadharNumber?: string;
  status?: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "";
  joiningDate?: string;
  lastWorkingDate?: string;
  address?: string;
  assignedServices?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Payment {
  _id?: Types.ObjectId;
  customerId: Types.ObjectId;
  amount?: number;
  modeOfPayment?: string;
  receivedDate?: Date;
  pendingAmount?: string;
  status?: "PAID" | "PARTIALLY" | "PENDING";
  remarks?: string;
  invoiceNumber?: string;
  createDate?: Date; // since you renamed createdAt
}

export interface Service {
  _id?: Types.ObjectId;
  customerId: Types.ObjectId;
  visitNo?: number;
  serviceDate?: Date;
  nextDueDate?: Date;
  notes?: string;
  paymentIds?: Types.ObjectId[];
  assignedDate?: Date;
  closingDate?: Date;
  serviceType?: (
    | "GENERAL_SERVICE"
    | "PAID_SERVICE"
    | "IN_WARRANTY_BREAKDOWN"
    | "FILTER_REPLACEMENT"
    | "INSTALLATION"
    | "RE_INSTALLATION"
    | "FEASIBILITY"
    | "SPARE_PART_REPLACEMENT"
    | "DEEP_CLEANING"
    | "SPMS_PLUS_REPLACEMENT"
    | "JOGDIAL_REPLACEMENT"
    | "DISPLAY_REPLACEMENT"
  )[];
  employeeId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  avgRating?: number;
}

export interface InputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

export interface Leads {
  id:string
  name: string;
  email: string;
  number: number;
  location: string;
  message: string;
  assignedTo: string;
  status: string;
  createdAt: Date;
}
