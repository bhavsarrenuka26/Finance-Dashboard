import React, { createContext, useState, useEffect } from "react";
import { initialTransactions } from "../data/mockData";

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  // ==========================================
  // 1. STATE INITIALIZATION
  // ==========================================

  // Transactions (with lazy loading from LocalStorage)
  const [transactions, setTransactions] = useState(() => {
    const savedData = localStorage.getItem("finance-dashboard-data");
    if (savedData) {
      return JSON.parse(savedData);
    }
    return initialTransactions;
  });

  // Basic States
  const [role, setRole] = useState("Viewer");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // New: Dark Mode State (remembers user preference in LocalStorage)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("finance-theme") === "dark";
  });

  // New: Loading State for our simulated API
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // 2. SIDE EFFECTS (useEffect Hooks)
  // ==========================================

  // Auto-save transactions whenever they change
  useEffect(() => {
    localStorage.setItem(
      "finance-dashboard-data",
      JSON.stringify(transactions),
    );
  }, [transactions]);

  // Toggle 'dark' class on HTML tag whenever isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("finance-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("finance-theme", "light");
    }
  }, [isDarkMode]);

  // ==========================================
  // 3. ACTIONS & LOGIC
  // ==========================================

  const toggleRole = () =>
    setRole((prev) => (prev === "Viewer" ? "Admin" : "Viewer"));

  // Updated with Mock API network delay
  const deleteTransaction = async (id) => {
    if (role === "Admin") {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Fake 0.5s delay

      setTransactions(transactions.filter((t) => t.id !== id));
      setIsLoading(false);
    }
  };

  // Updated with Mock API network delay
  // Inside FinanceContext.jsx
  const addTransaction = async (newTransaction) => {
    if (role !== "Admin") return;

    // 1. Calculate the current balance before adding!
    const currentIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const currentExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const currentBalance = currentIncome - currentExpense;

    // 2. Guard Check: Is it an expense? Is it too big?
    if (
      newTransaction.type === "expense" &&
      newTransaction.amount > currentBalance
    ) {
      alert(`Transaction failed! You only have ₹${currentBalance} available.`);
      return; // Stop the function completely
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const transactionWithId = { ...newTransaction, id: `TXN-${Date.now()}` };
    setTransactions([transactionWithId, ...transactions]);
    setIsLoading(false);
  };
  // NEW: Edit Transaction Function
  const editTransaction = async (updatedTransaction) => {
    if (role !== "Admin") return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Fake network delay

    // Map over the array: if the ID matches, replace it with the new data. Otherwise, keep the old one.
    setTransactions((prevTransactions) =>
      prevTransactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t,
      ),
    );

    setIsLoading(false);
  };

  // ==========================================
  // 4. PROVIDER EXPORT
  // ==========================================
  return (
    <FinanceContext.Provider
      value={{
        transactions,
        role,
        toggleRole,
        deleteTransaction,
        addTransaction,
        editTransaction,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        isDarkMode,
        setIsDarkMode,
        isLoading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
