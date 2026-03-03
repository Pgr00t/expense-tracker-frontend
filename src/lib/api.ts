import axios from "axios";

// Default to local Django server if not provided via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Expense Types
export interface Expense {
  id: number;
  title: string;
  amount: string | number;
  currency: string;
  category: string;
  date: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// API functions
export const getExpenses = async () => {
  const response = await apiClient.get<Expense[]>("expenses/");
  return response.data;
};

export const createExpense = async (data: Omit<Expense, "id" | "created_at" | "updated_at">) => {
  const response = await apiClient.post<Expense>("expenses/", data);
  return response.data;
};

export const updateExpense = async (id: number, data: Partial<Expense>) => {
  const response = await apiClient.put<Expense>(`expenses/${id}/`, data);
  return response.data;
};

export const deleteExpense = async (id: number) => {
  await apiClient.delete(`expenses/${id}/`);
};

export const getExpenseSummary = async () => {
  const response = await apiClient.get<{
    total_amount: number;
    category_breakdown: { category: string; total: number }[];
  }>("expenses/summary/");
  return response.data;
};

export const convertCurrency = async (amount: number, from: string, to: string) => {
  const response = await apiClient.get<{
    converted_amount: number;
    rate: number;
    currency: string;
    base: string;
  }>(`expenses/convert_currency/?amount=${amount}&from=${from}&to=${to}`);
  return response.data;
};
