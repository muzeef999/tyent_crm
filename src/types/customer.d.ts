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
  tdsValue: string,
  phValue: string,
  inputWaterFlow: string,
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
  onKeyDown?:React.KeyboardEventHandler<HTMLInputElement>;
  onBlur?: () => void; // ⬅ optional
}

export interface Leads {
  id: string;
  name: string;
  email: string;
  number: number;
  location: string;
  message: string;
  assignedTo: string;
  status: string;
  createdAt: Date;
}


export interface Product {
  _id: ObjectId;
  name: string;
  stock: number;
  status :"In Stock" | "Out of Stock" ;
  assignedTo :Types.ObjectId;            
  createdAt:Date;
  serialNumber:string
}


// Location.ts
export interface Location {
  _id: ObjectId;
  employeeId: Types.ObjectId;            // "Main Warehouse" | "Office Delhi" | "Employee: Vamsi"
  type: "WAREHOUSE" | "OFFICE" | "EMPLOYEE";
  city?: string;
  active: boolean;
  createdAt:Date;
}


// Serial.ts
export interface Serial {
  _id: ObjectId;
  productId: ObjectId;
  serialNo: string;          // e.g., 000081
  status: "IN_STOCK" | "DEMO" | "INSTALLED" | "SCRAP";
  locationId: ObjectId;      // where it physically is
  holderId?: ObjectId;       // employee if DEMO
  notes?: string;
  history: Array<{
    date: Date;
    fromLocationId?: ObjectId;
    toLocationId?: ObjectId;
    action: "RECEIVE"|"DISPATCH"|"TRANSFER"|"DEMO_ASSIGN"|"DEMO_RETURN"|"INSTALL"|"SCRAP";
    ref?: string;
    userId?: ObjectId;
  }>
}


// Movement.ts
export interface Movement {
  _id: ObjectId;
  date: Date;
  type: "IN" | "OUT" | "TRANSFER" | "ADJUST";
  reason: "PURCHASE"|"SALE"|"INSTALL"|"REPLACEMENT"|"DEMO_ASSIGN"|"DEMO_RETURN"|"SCRAP"|"PART_HARVEST"|"OPENING";
  productId: ObjectId;
  qty: number;                   // negative for OUT (or use type to sign)
  serialIds?: ObjectId[];        // required for trackSerial products
  fromLocationId?: ObjectId;
  toLocationId?: ObjectId;
  refDoc?: string;               // invoice/job number
  notes?: string;
  userId?: ObjectId;
  createdAt: Date;
}

 
// Balance.ts
export interface Balance {
  _id: ObjectId;
  productId: ObjectId;
  locationId: ObjectId;
  qty: number;              // current balance
  updatedAt: Date;
}


// PartHarvest.ts
export interface PartHarvest {
  _id: ObjectId;
  sourceProductId: ObjectId;
  sourceSerialId?: ObjectId;
  partProductId: ObjectId;   // e.g., "Motherboard"
  qty: number;
  date: Date;
  notes?: string;
}
