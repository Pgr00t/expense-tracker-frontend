"use client";

import { useEffect, useState } from "react";
import { getExpenses, deleteExpense, Expense } from "@/lib/api";
import ExpenseForm from "@/components/ExpenseForm";
import { Plus, Edit2, Trash2, Calendar, FileText, ArrowUpDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";

export default function ExpensesLedger() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const data = await getExpenses();
            setExpenses(data);
        } catch {
            toast.error("Failed to fetch ledger data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingExpense(null);
        setModalOpen(true);
    };

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        setDeletingId(id);
        try {
            await deleteExpense(id);
            toast.success("Expense deleted successfully");
            fetchExpenses();
        } catch {
            toast.error("Failed to delete expense");
        } finally {
            setDeletingId(null);
        }
    };

    const handleFormSuccess = () => {
        setModalOpen(false);
        toast.success(editingExpense ? "Expense updated!" : "Expense added!");
        fetchExpenses();
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Expense Ledger
                    </h1>
                    <p className="text-gray-400 mt-1">Manage and track all your transactions.</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Expense
                </button>
            </div>

            {/* Ledger Table */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : expenses.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-48 text-gray-500 space-y-4">
                            <FileText className="w-12 h-12 opacity-20" />
                            <p>No expenses found. Create one to get started.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="text-xs uppercase bg-gray-800/80 text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-xl"><div className="flex items-center gap-2">Date <ArrowUpDown className="w-3 h-3" /></div></th>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="w-4 h-4 opacity-50" />
                                                {format(parseISO(expense.date), "MMM dd, yyyy")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">{expense.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-700">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-emerald-400">
                                            ${Number(expense.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(expense)}
                                                    className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    disabled={deletingId === expense.id}
                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === expense.id ? <div className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 block relative">
                        <h2 className="text-xl font-bold text-white mb-5">
                            {editingExpense ? "Edit Expense" : "Add New Expense"}
                        </h2>
                        <ExpenseForm
                            initialData={editingExpense}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
