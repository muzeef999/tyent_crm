import axiosInstance from "@/lib/axiosInstance";
import { Account, Customer, Employee, Payment, Service } from "@/types/customer";
import axios from "axios";



//Auth
export const login = (contactNumber: string) => axiosInstance.get(`/auth/login?contactNumber=${contactNumber}`).then((res) => res.data);
export const verifyOtp = (contactNumber: string, otp: string) => axiosInstance.post("/auth/verify-otp", { contactNumber, otp }).then((res) => res.data);
export const userProfile = () => axiosInstance.get("/auth/me").then((res) => res.data);
export const logout = () => axiosInstance.post("/auth/me").then((res) => res.data);
//CUSTOMERS 


// api.ts
export const getCustomerAnalysis = (params?: { start?: string; end?: string }) => {
  return axiosInstance
    .get("/customers/analytics", { params }) // Axios automatically appends ?start=...&end=...
    .then((res) => res.data);
};


export const getCustomers = async ({ page = 1, limit = 10, type, q = ""}: { page?: number; limit?: number; type?: string; q?:string}) => {
  const params: Record<string, string | number> = { page, limit, q };
  if (type) {
    const [key, value] = type.split("="); 
    if (key && value) {
      params[key] = value; 
    }
  }
  const res = await axiosInstance.get(`/customers`, { params });return res.data;
};




export const getCustomerInDetail = (id: string) => axiosInstance.get(`customers/${id}`).then((res) => res.data);
export const createCustomer = (data: Customer) => axiosInstance.post("/customers", data).then((res) => res.data);
export const updateCustomer = (id: string) =>axiosInstance.put(`/customers/${id}`).then((res) => res.data);
export const deleteCustomer = (id: string) => axiosInstance.delete(`/customers/${id}`).then((res) => res.data);
export const getCustomerById = (id: string) => axiosInstance.get(`/customers/${id}`).then((res) => res.data);


//SERVICES
export const createService = (data: {customerId: string;serviceDate: string; serviceType: string[];}) => axiosInstance.post("/services", data).then((res) => res.data);
export const updateService = (id: string, updatedFields: Record<string, any>) => axiosInstance.patch(`/services/${id}`,updatedFields).then((res) => res.data);
export const deleteService = (id: string) => axiosInstance.delete(`/services/${id}`).then((res) => res.data);
export const getServiceById = (id: string) => axiosInstance.get(`/services/${id}`).then((res) => res.data);


// servicesApi.ts
export const getServices = (query: string) =>  axiosInstance.get(`/services?${query}`).then((res) => res.data);


// serviceApis.ts
export const analytics = ({   startDate, 
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
export const getEmployees = async ({  startDate,  endDate,  page = 1, limit = 10, q = "",}: {  page?: number;  limit?: number;
  q?: string; startDate?: Date | null;  endDate?: Date | null;}) => {
  const params: Record<string, string | number> = {page, limit,  q,};

  if (startDate) { params.start = startDate.toISOString().split("T")[0];  }

  if (endDate) { params.end = endDate.toISOString().split("T")[0];}

  const res = await axiosInstance.get(`/employees`, { params });
  return res.data;
};



export const employeeAnalytics = async ({  startDate, endDate,}: { startDate?: Date | null; endDate?: Date | null;}) => {
  
  const params: Record<string, string> = {};

  if (startDate) {  params.start = startDate.toISOString().split("T")[0]; }

  if (endDate) { params.end = endDate.toISOString().split("T")[0];}

  const res = await axiosInstance.get(`/employees/analytics?`, { params });

  return res.data;
};


export const createEmployee = (employee: Employee) => axiosInstance.post("/employees", employee).then((res) => res.data);
export const  MarkingMangerOptionsfetch = () => axiosInstance.get("/employees/MarkingMangerOptions").then((res) => res.data);
export const  TechincianOptionsfetch = () => axiosInstance.get("/employees/TechincianOptions").then((res) => res.data);
export const employeAssignTask =(id:string) => axiosInstance.get(`/employees/${id}`).then((res) => res.data);
export const updateEmployee = (id: string) => axiosInstance.put(`/employees/${id}`).then((res) => res.data);
export const deleteEmployee = (id: string) => axiosInstance.delete(`/employees/${id}`).then((res) => res.data);
export const getEmployeeById = (id: string) => axiosInstance.get(`/employees/${id}`).then((res) => res.data);





//Leads
export const getLeads = () => axios.get("https://www.tyent.co.in/api/lead").then((res) => res.data);


//products
export const getProducts = (type:string) => axiosInstance.get(`/products/${type}`).then(res => res.data).catch(err => err.message);
export const getProductsIndetail = (serialNumber:any) => axiosInstance.get(`/products/${serialNumber}`).then(res => res.data).catch(err => err.message);
export const createProduct = (data: {name: string; category: string; serialNumber: string;}) => axiosInstance.post("/products", data).then(res => res.data).catch(err => err.message);
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