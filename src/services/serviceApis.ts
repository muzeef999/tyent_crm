import axiosInstance from "@/lib/axiosInstance";
import { Account, Customer, Employee, Payment, Service } from "@/types/customer";

//CUSTOMERS
export const getCustomers = () => axiosInstance.get("/customers").then((res) => res.data);
export const createCustomer = (data: Omit<Customer, '_id' | 'createdAt' | 'updatedAt'>) => axiosInstance.post("/customers", data).then((res) => res.data);
export const updateCustomer = (id: string) =>axiosInstance.put(`/customers/${id}`).then((res) => res.data);
export const deleteCustomer = (id: string) => axiosInstance.delete(`/customers/${id}`).then((res) => res.data);
export const getCustomerById = (id: string) => axiosInstance.get(`/customers/${id}`).then((res) => res.data);


//SERVICES
export const getServices = () => axiosInstance.get("/services").then((res) => res.data);
export const createService = (data: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>) => axiosInstance.post("/services", data).then((res) => res.data);
export const updateService = (id: string) => axiosInstance.put(`/services/${id}`).then((res) => res.data);
export const deleteService = (id: string) => axiosInstance.delete(`/services/${id}`).then((res) => res.data);
export const getServiceById = (id: string) => axiosInstance.get(`/services/${id}`).then((res) => res.data);

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
export const getEmployees = () => axiosInstance.get("/employees").then((res) => res.data);
export const createEmployee = (data: Omit<Employee, '_id' | 'createdAt' | 'updatedAt'>) => axiosInstance.post("/employees", data).then((res) => res.data);
export const updateEmployee = (id: string) => axiosInstance.put(`/employees/${id}`).then((res) => res.data);
export const deleteEmployee = (id: string) => axiosInstance.delete(`/employees/${id}`).then((res) => res.data);
export const getEmployeeById = (id: string) => axiosInstance.get(`/employees/${id}`).then((res) => res.data);
