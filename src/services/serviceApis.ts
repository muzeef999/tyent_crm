// services/apis.ts
"use client";
import axiosInstance from "@/lib/axiosInstance";

export const getcustomers = () => axiosInstance.get("/customers").then((res) => res.data);

