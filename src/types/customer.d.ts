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
  installedBy?: string;
  marketingManager?: string;
  R0?: boolean;
  pressureTank?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
