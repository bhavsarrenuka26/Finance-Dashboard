import React, { useState, useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { X } from 'lucide-react';

export default function AddTransactionModal({ onClose, transactionToEdit }) {
  const { addTransaction, editTransaction, isLoading } = useContext(FinanceContext);
  
  const [formData, setFormData] = useState(
    transactionToEdit || {
      date: '',
      category: '',
      amount: '',
      type: 'expense'
    }
  );

  // NEW: Calculate today's date in YYYY-MM-DD format for the local timezone
  const today = new Date();
  const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.category || !formData.amount) return;

    if (transactionToEdit) {
      await editTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    } else {
      await addTransaction({
        ...formData,
        amount: parseFloat(formData.amount) 
      });
    }
    
    onClose(); 
  };

  const modalTitle = transactionToEdit ? "Edit Transaction" : "Add Transaction";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative transition-colors border border-transparent dark:border-gray-700">
        
        <button 
          onClick={onClose} 
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white transition-colors">
          {modalTitle}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Date</label>
            <input 
              type="date" 
              required 
              max={maxDate} // FIX: Prevents selecting future dates!
              value={formData.date}
              className="w-full border dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={e => setFormData({...formData, date: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Category</label>
            <input 
              type="text" 
              placeholder="e.g. Groceries" 
              required 
              value={formData.category} 
              className="w-full border dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-400"
              onChange={e => setFormData({...formData, category: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Amount (₹)</label>
            <input 
              type="number" 
              step="1" // FIX: Changes arrow increment from 0.01 to 1 Rupee
              min="1"  // FIX: Prevents 0 or negative numbers
              required 
              value={formData.amount} 
              className="w-full border dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={e => setFormData({...formData, amount: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Type</label>
            <select 
              value={formData.type} 
              className="w-full border dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                'Save Transaction'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}