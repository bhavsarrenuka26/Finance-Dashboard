# 📊 FinDash - Premium Personal Finance Dashboard

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-blue?style=for-the-badge&logo=netlify)](https://finance-dashboard-renuka.netlify.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/bhavsarrenuka26/Finance-Dashboard)

FinDash is a modern, responsive, SaaS-style personal finance tracker built with React and Tailwind CSS. It goes beyond basic CRUD operations by offering intelligent financial insights, interactive data visualization, and a deeply integrated dark mode.

## ✨ Key Features

### 🧠 Smart Insights Engine
- **Algorithmic Summaries:** Automatically calculates and highlights your "Top Spend Category", "Largest Single Expense", and overall "Savings Rate".
- **Dynamic Empty States:** Graceful, beautifully designed fallback UI that guides the user when no transaction data is available.

### 📈 Advanced Data Visualization (Recharts)
- **Cash Flow Overview (Area Chart):** A time-series chart with a smooth gradient fill. Features a **custom Time Brush slider** at the bottom, allowing users to zoom in and scrub through specific date ranges without horizontal crowding.
- **Expense Breakdown (Bar Chart):** A dynamic, horizontal bar chart that automatically sorts categories from highest to lowest spend, providing immediate visual hierarchy compared to traditional pie charts.

### 🎛️ Robust Transaction Management
- **Full CRUD:** Add, Edit, and Delete transactions with a beautiful backdrop-blurred modal.
- **Data Validation:** Prevents future-date selection and enforces proper numeric increments.
- **Advanced Filtering & Sorting:** Search by category name, filter by Income/Expense, and sort by Date or Amount (Highest/Lowest).
- **CSV Export:** One-click export of your filtered financial data into an Excel-ready `.csv` file.

### 🎨 Premium UI/UX
- **True Dark Mode:** Context-driven theme switching that dynamically updates everything—from background colors to specific Recharts tooltip text colors.
- **Micro-interactions:** Smooth hover lifts (`-translate-y`), deepening shadows, and scaling icons that make the dashboard feel tactile and alive.
- **Responsive Navigation:** A mobile-first `TopBar` that gracefully stacks on smaller screens, ensuring no elements are squished.
- **Role-Based Access:** Toggle between `Admin` (full edit rights) and `Viewer` (read-only mode) to simulate real-world app permissions.

### 💾 Local Storage Persistence
- User transactions, current theme preference, and role state are all saved instantly to the browser's `localStorage`, ensuring data survives page refreshes.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React.js (Vite)
* **Styling:** Tailwind CSS (with arbitrary values and dark mode class strategy)
* **Icons:** Lucide React
* **Data Visualization:** Recharts
* **State Management:** React Context API

---

## 🚀 Getting Started (Local Development)

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhavsarrenuka26/Finance-Dashboard.git

2. **Navigate into the directory:**
     ```bash
     cd Finance-Dashboard
3. **Install dependencies and run development server:**  
     ```bash
     npm install

     npm run dev
