import React, { useContext } from "react";
import { FinanceProvider, FinanceContext } from "./context/FinanceContext";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import { Sun, Moon, Shield, User } from 'lucide-react'; 

const TopBar = () => {
  // FIX: Brought back setIsDarkMode!
  const { role, toggleRole, isDarkMode, setIsDarkMode } = useContext(FinanceContext);
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm px-6 py-4 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

        {/* --- Top Row (Mobile) / Left Side (Desktop) --- */}
        <div className="w-full sm:w-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
            FinDash
          </h1>

          {/* Theme Toggle (Mobile) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)} // FIX: Using setIsDarkMode
            className="sm:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* --- Bottom Row (Mobile) / Right Side (Desktop) --- */}
        <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center gap-3">

          <div className="flex items-center gap-3 flex-1 sm:flex-initial">
            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <span className="hidden md:inline">Current Role:</span>
              <span className="font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1 border border-gray-200 dark:border-gray-700 transition-colors">
                {role === 'Admin' ? <Shield size={14} className="text-blue-500"/> : <User size={14} className="text-gray-500"/>}
                {role}
              </span>
            </div>

            <button
              onClick={toggleRole}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex-1 sm:flex-initial text-center font-medium"
            >
              Switch to {role === 'Viewer' ? 'Admin' : 'Viewer'}
            </button>
          </div>

          {/* Theme Toggle (Desktop) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)} // FIX: Using setIsDarkMode
            className="hidden sm:block p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

        </div>
      </div>
    </header>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen flex flex-col font-sans bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
        <TopBar />
        <main className="flex-1 max-w-7xl w-full mx-auto pb-12">
          <Dashboard />
          <Transactions />
        </main>
      </div>
    </FinanceProvider>
  );
}