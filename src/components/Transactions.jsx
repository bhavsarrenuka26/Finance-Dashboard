import React, { useContext, useState } from "react";
import { FinanceContext } from "../context/FinanceContext";
import AddTransactionModal from "./AddTransactionModal";
import { Trash2, Plus, Search, Download, Pencil } from "lucide-react";

export default function Transactions() {
  const {
    transactions,
    role,
    deleteTransaction,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    isLoading 
  } = useContext(FinanceContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("date-desc");
  
  // NEW: State to track which transaction we are editing
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  // 1. Apply filters (Search & Type)
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  // 2. Apply sorting to the filtered list
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "amount-desc") return b.amount - a.amount;
    if (sortBy === "amount-asc") return a.amount - b.amount;
    if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
    return new Date(b.date) - new Date(a.date); // default newest first
  });

  // 3. Export logic (Excel-safe with quotes)
  const exportToCSV = () => {
    const headers = ["ID", "Date", "Category", "Amount", "Type"];
    const csvRows = sortedTransactions.map((t) =>
      [`"${t.id}"`, `"${t.date}"`, `"${t.category}"`, t.amount, t.type].join(",")
    );
    const csvString = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "finance_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler to open modal for Adding (clears edit state)
  const handleOpenAdd = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  // Handler to open modal for Editing
  const handleOpenEdit = (transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
          Recent Transactions
        </h2>

        {/* Filter, Sort & Action Controls */}
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search category..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <select
            className="border rounded-lg px-4 py-2 focus:outline-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>

          {/* Sort Filter */}
          <select
            className="border rounded-lg px-4 py-2 focus:outline-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Add Button (Admin Only) */}
          {role === "Admin" && (
            <button
              onClick={handleOpenAdd}
              disabled={isLoading}
              className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Plus size={18} /> 
              <span className="hidden sm:inline">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-x-auto border border-transparent dark:border-gray-800 transition-colors">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 transition-colors">
              <th className="p-4 text-gray-600 dark:text-gray-300 font-medium">Date</th>
              <th className="p-4 text-gray-600 dark:text-gray-300 font-medium">Category</th>
              <th className="p-4 text-gray-600 dark:text-gray-300 font-medium">Amount</th>
              {role === "Admin" && (
                <th className="p-4 text-gray-600 dark:text-gray-300 font-medium w-32">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b dark:border-gray-800 last:border-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                >
                  <td className="p-4 text-gray-700 dark:text-gray-400">{t.date}</td>
                  <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">{t.category}</td>
                  <td
                    className={`p-4 font-semibold ${
                      t.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  {role === "Admin" && (
                    <td className="p-4 flex gap-2">
                      {/* NEW: Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(t)}
                        disabled={isLoading}
                        className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition disabled:opacity-50"
                        title="Edit Transaction"
                      >
                        <Pencil size={18} />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-50"
                        title="Delete Transaction"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-12 text-center text-gray-500 dark:text-gray-400">
                  No transactions found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Render Modal if open, passing the edit state */}
      {isModalOpen && (
        <AddTransactionModal 
          onClose={() => {
            setIsModalOpen(false);
            setTransactionToEdit(null); // Clear edit state when closing
          }} 
          transactionToEdit={transactionToEdit}
        />
      )}
    </div>
  );
}