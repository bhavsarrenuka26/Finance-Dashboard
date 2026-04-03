import React, { useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { 
  AreaChart, Area, CartesianGrid, BarChart, Bar, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, Brush, Cell
} from 'recharts';
import { TrendingUp, AlertCircle, Award, Target } from 'lucide-react';

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];
export default function Dashboard() {
  const { transactions, isDarkMode } = useContext(FinanceContext);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) existing.amount += t.amount;
      else acc.push({ name: t.category, amount: t.amount });
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount);

  const topCategory = expenseData.length > 0 ? expenseData[0] : null;
  const largestExpense = [...transactions]
    .filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0];
  const savingsRate = totalIncome > 0 
    ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) 
    : 0;

  const groupedTransactions = transactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = 0; 
    acc[t.date] += (t.type === 'income' ? t.amount : -t.amount);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(a) - new Date(b));

  let runningBalance = 0;
  const balanceData = sortedDates.map(dateStr => {
    runningBalance += groupedTransactions[dateStr];
    const dateObj = new Date(dateStr);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    return { date: formattedDate, balance: runningBalance };
  });

  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    borderRadius: '8px',
    border: isDarkMode ? 'none' : '1px solid #e5e7eb',
    color: isDarkMode ? '#ffffff' : '#111827'
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
        Financial Overview
      </h2>
      
      {/* Summary Cards with Hover Lift Effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ADDED: hover:-translate-y-1 hover:shadow-lg duration-300 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{balance.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-green-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹{totalIncome.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-red-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">₹{totalExpense.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 mt-6 rounded-xl shadow-sm text-center border-2 border-dashed border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300">
            <Target size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Data Available</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Your dashboard is looking a little empty! Switch to the Admin role and add your first transaction to see your financial insights here.
          </p>
        </div>
      ) : (
        <>
          {/* Smart Insights Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-6 transition-colors">
            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Target size={16} /> Quick Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* ADDED: Hover backgrounds for individual insight blocks */}
              <div className="flex items-start gap-3 p-3 -m-3 rounded-xl hover:bg-white dark:hover:bg-blue-900/40 transition-all duration-300 cursor-default">
                <div className="p-2 bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400 rounded-lg">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Top Spend Category</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">
                    {topCategory ? `${topCategory.name} (₹${topCategory.amount.toLocaleString('en-IN')})` : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 -m-3 rounded-xl hover:bg-white dark:hover:bg-blue-900/40 transition-all duration-300 cursor-default">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Largest Single Expense</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">
                    {largestExpense ? `${largestExpense.category} (₹${largestExpense.amount.toLocaleString('en-IN')})` : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 -m-3 rounded-xl hover:bg-white dark:hover:bg-blue-900/40 transition-all duration-300 cursor-default">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">
                    {savingsRate}% of income saved
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* ADDED: Hover drop shadows on the Chart Containers */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 h-96 lg:h-[400px] flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Cash Flow Overview</h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={balanceData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#e5e7eb"} strokeOpacity={0.4} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} padding={{ left: 20, right: 20 }} minTickGap={30} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#3b82f6' }} formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Balance']} />
                    <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fill="url(#colorBalance)" activeDot={{ r: 6 }} />
                    <Brush dataKey="date" height={30} stroke={isDarkMode ? "#4b5563" : "#d1d5db"} fill={isDarkMode ? "#1f2937" : "#f3f4f6"} tickFormatter={() => ''} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col min-h-[400px]">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Expense Breakdown</h3>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height={expenseData.length * 50 + 100}>
                  <BarChart layout="vertical" data={expenseData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={tooltipStyle} itemStyle={{ color: isDarkMode ? '#e5e7eb' : '#374151' }} formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Total Spent']} />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={25}>
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}