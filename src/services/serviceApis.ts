import axiosInstance from "@/lib/axiosInstance";
import { Account, Customer, Employee, Payment, Service } from "@/types/customer";
import axios from "axios";



//Auth

export const login = (contactNumber: string) => axiosInstance.get(`/auth/login?contactNumber=${contactNumber}`).then((res) => res.data);
export const verifyOtp = (contactNumber: string, otp: string) => axiosInstance.post("/auth/verify-otp", { contactNumber, otp }).then((res) => res.data);
//CUSTOMERS 


export const getCustomerAnalysis = () => axiosInstance.get("/customers/analytics").then((res) => res.data);

export const getCustomers = async ({ page = 1, limit = 10,state }: { page?: number; limit?: number;  state?: string; }) => {
  const query = new URLSearchParams();

  if (page) query.append("page", String(page));
  if (limit) query.append("limit", String(limit));
  if (state) query.append("state", state);

  const res = await axiosInstance.get(`/customers/?${state}`);
  return res.data;
};


export const getCustomerInDetail = (id: string) => axiosInstance.get(`customers/${id}`).then((res) => res.data);
export const createCustomer = (data: Customer) => axiosInstance.post("/customers", data).then((res) => res.data);
export const updateCustomer = (id: string) =>axiosInstance.put(`/customers/${id}`).then((res) => res.data);
export const deleteCustomer = (id: string) => axiosInstance.delete(`/customers/${id}`).then((res) => res.data);
export const getCustomerById = (id: string) => axiosInstance.get(`/customers/${id}`).then((res) => res.data);


//SERVICES

export const createService = (data: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>) => axiosInstance.post("/services", data).then((res) => res.data);
export const updateService = (id: string, updatedFields: Record<string, any>) => axiosInstance.patch(`/services/${id}`,updatedFields).then((res) => res.data);
export const deleteService = (id: string) => axiosInstance.delete(`/services/${id}`).then((res) => res.data);
export const getServiceById = (id: string) => axiosInstance.get(`/services/${id}`).then((res) => res.data);


export const getServices = ({startDate, endDate, type} :{ startDate?: Date | null; endDate?: Date | null; type?: string | null; }) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate.toISOString().split("T")[0]); // YYYY-MM-DD
  if (endDate) params.append("endDate", endDate.toISOString().split("T")[0]);
  if (type) params.append("type", type);

  return axiosInstance.get(`/services?${params.toString()}`).then((res) => res.data);
};

// serviceApis.ts
export const analytics = ({ 
  startDate, 
  endDate 
}: { startDate?: Date | null; endDate?: Date | null }) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate.toISOString().split("T")[0]); // YYYY-MM-DD
  if (endDate) params.append("endDate", endDate.toISOString().split("T")[0]);

  return axiosInstance
    .get(`/services/analytics?${params.toString()}`)
    .then((res) => res.data);
};


//ACCOUNTS
export const getAccounts = () => axiosInstance.get("/accounts").then((res) => res.data);
export const createAccount = (data: Omit<Account, '_id' | 'createdAt' | 'updatedAt'>) => axiosInstance.post("/accounts", data).then((res) => res.data);
export const updateAccount = (id: string) => axiosInstance.put(`/accounts/${id}`).then((res) => res.data);
export const deleteAccount = (id: string) => axiosInstance.delete(`/accounts/${id}`).then((res) => res.data);
export const getAccountById = (id: string) => axiosInstance.get(`/accounts/${id}`).then((res) => res.data);


//PAYMENTS
export const getPayments = () => axiosInstance.get("/payments").then((res) => res.data);
export const createPayment = (data: Omit<Payment, '_id' | 'createdAt' | 'updatedAt'>) => axiosInstance.post("/payments", data).then((res) => res.data);
export const updatePayment = (id: string) => axiosInstance.put(`/payments/${id}`).then((res) => res.data);
export const deletePayment = (id: string) => axiosInstance.delete(`/payments/${id}`).then((res) => res.data);
export const getPaymentById = (id: string) => axiosInstance.get(`/payments/${id}`).then((res) => res.data); 


//EMPLOYEES

export const getEmployees = async ({
  page,
  limit,
  searchQuery = "",
  getAll = false,
}: {
  page?: number;
  limit?: number;
  searchQuery?: string;
  getAll?: boolean;
}) => {
  const params: Record<string, string> = {};
  
  // Add search query if provided
  if (searchQuery) {
    params.q = searchQuery;
  }

  // Only add pagination params if not fetching all records
  if (!getAll) {
    params.page = String(page);
    params.limit = String(limit);
  }

  const queryString = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(`/employees?${queryString}`);
  return res.data; // contains { data, pagination }
};

export const createEmployee = (employee: Employee) => axiosInstance.post("/employees", employee).then((res) => res.data);
export const updateEmployee = (id: string) => axiosInstance.put(`/employees/${id}`).then((res) => res.data);
export const deleteEmployee = (id: string) => axiosInstance.delete(`/employees/${id}`).then((res) => res.data);
export const getEmployeeById = (id: string) => axiosInstance.get(`/employees/${id}`).then((res) => res.data);

export const employeeAnlaytics = () => axiosInstance.get(`/employees/analytics`).then((res) => res.data);



//Leads
export const getLeads = () => axios.get("https://www.tyent.co.in/api/lead").then((res) => res.data);


//products
export const getProducts = () => axiosInstance.get(`/products`).then(res => res.data).catch(err => err.message);
export const getProductsIndetail = (serialNumber:any) => axiosInstance.get(`/products/${serialNumber}`).then(res => res.data).catch(err => err.message);

//location
export const getLocation = () => axiosInstance.get("/stock/locations").then(res => res.data);

//serials
export const getSerials = () => axiosInstance.get("/stock/serials").then(res => res.data);

//movements
export const getmovements = () => axiosInstance.get("/stock/movements").then(res => res.data);

//balances
export const getBalances = () => axiosInstance.get("/stock/balances").then(res => res.data);

//part  harvests
export const getPartharvests = () => axiosInstance.get("/stock/partharvests").then(res => res.data);