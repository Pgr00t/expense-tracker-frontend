import Link from "next/link";
import { Wallet, PieChart } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 text-white transition-opacity hover:opacity-80">
                    <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg p-1.5 shadow-lg shadow-indigo-500/20">
                        <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        CiteWorks Expense
                    </span>
                </Link>
                <div className="flex space-x-6 items-center">
                    <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
                        <PieChart className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/expenses" className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
                        <Wallet className="w-4 h-4" />
                        <span>Ledger</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
