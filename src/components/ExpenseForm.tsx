"use client";

import { useState } from "react";
import { createExpense, updateExpense, Expense } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface ExpenseFormProps {
    initialData?: Expense | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const CATEGORIES = [
    "Food & Dining",
    "Transportation",
    "Housing",
    "Entertainment",
    "Shopping",
    "Healthcare",
    "Utilities",
    "Miscellaneous"
];

export default function ExpenseForm({ initialData, onSuccess, onCancel }: ExpenseFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        amount: initialData?.amount || "",
        category: initialData?.category || CATEGORIES[0],
        date: initialData?.date || new Date().toISOString().split("T")[0],
        description: initialData?.description || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                title: formData.title,
                amount: Number(formData.amount),
                currency: "USD",
                category: formData.category,
                date: formData.date,
                description: formData.description,
            };

            if (initialData?.id) {
                await updateExpense(initialData.id, payload);
            } else {
                await createExpense(payload);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-900/50 text-red-200 text-sm rounded-lg border border-red-500/20">{error}</div>}

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. Groceries"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount (USD)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="amount"
                        required
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 transition-colors"
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 transition-colors"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 transition-colors resize-none"
                    placeholder="Additional details..."
                ></textarea>
            </div>

            <div className="flex space-x-3 pt-4 border-t border-gray-800">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex justify-center items-center disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (initialData ? "Save Changes" : "Create Expense")}
                </button>
            </div>
        </form>
    );
}
