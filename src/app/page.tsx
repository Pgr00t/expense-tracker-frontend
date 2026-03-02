"use client";

import { useEffect, useState } from "react";
import { getExpenseSummary, convertCurrency } from "@/lib/api";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { DollarSign, TrendingUp, RefreshCw, ArrowRightLeft } from "lucide-react";
import toast from "react-hot-toast";

const COLORS = ['#818cf8', '#c084fc', '#f472b6', '#fbbf24', '#34d399', '#60a5fa'];

export default function Dashboard() {
  const [summary, setSummary] = useState({ total_amount: 0, category_breakdown: [] });
  const [loading, setLoading] = useState(true);
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await getExpenseSummary();
      setSummary(data as any);
      // Reset conversion when summary changes
      setConvertedAmount(null);
    } catch (error) {
      toast.error("Failed to load dashboard summary");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if (summary.total_amount <= 0) return;
    setConverting(true);
    try {
      const data = await convertCurrency(summary.total_amount, "USD", targetCurrency);
      setConvertedAmount(data.converted_amount);
      toast.success(`Converted to ${targetCurrency}`);
    } catch (error) {
      toast.error("Currency conversion failed (Frankfurter API)");
      console.error(error);
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 mt-1">Your financial summary at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Expenses Card */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24 text-indigo-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-400 mb-1">Total Expenses (USD)</p>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              ${summary.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <div className="mt-4 flex items-center text-sm text-emerald-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Up to date</span>
            </div>
          </div>
        </div>

        {/* Currency Converter Card */}
        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-300">Live Currency Conversion</p>
              <ArrowRightLeft className="w-4 h-4 text-purple-400" />
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <select
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
                className="bg-black/50 border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none"
              >
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="INR">INR (₹)</option>
              </select>
              <button
                onClick={handleConvert}
                disabled={converting || summary.total_amount <= 0}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <RefreshCw className={`w-4 h-4 ${converting ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="mt-4 h-12 flex items-end">
              {convertedAmount !== null ? (
                <h3 className="text-3xl font-bold text-white tracking-tight animate-in slide-in-from-bottom-2 fade-in">
                  {targetCurrency} {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              ) : (
                <p className="text-sm text-gray-500">Click refresh to convert from USD.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-6">Expenses by Category</h3>

        {summary.category_breakdown.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={summary.category_breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="category"
                  stroke="none"
                >
                  {summary.category_breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-500">
            No expenses recorded yet. Head to the Ledger to add some!
          </div>
        )}
      </div>
    </div>
  );
}
