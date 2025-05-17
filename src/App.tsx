import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./components/Overview";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";
import Budget from "./components/Budget";
import Reports from "./components/Reports/Reports";
import Settings from "./components/Settings";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState<any[]>(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [currency, setCurrency] = useState<string>(() => {
    const savedCurrency = localStorage.getItem("currency");
    return savedCurrency || "INR";
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const formatCurrency = (amount: number): string => {
    const currencySymbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      INR: "₹",
    };

    const currencyFormats: Record<
      string,
      { minimumFractionDigits: number; maximumFractionDigits: number }
    > = {
      USD: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      EUR: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      GBP: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      JPY: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
      INR: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    };

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      ...(currencyFormats[currency] || {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    }).format(amount);
  };

  const addTransaction = (transaction: any) => {
    try {
      const newTransaction = {
        ...transaction,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat(transaction.amount),
        date: new Date(transaction.date).toISOString(),
      };

      if (!newTransaction.amount || isNaN(newTransaction.amount)) {
        throw new Error("Invalid amount");
      }
      if (!newTransaction.description) {
        throw new Error("Description is required");
      }
      if (!newTransaction.category) {
        throw new Error("Category is required");
      }

      setTransactions((prevTransactions: any[]) => [
        ...prevTransactions,
        newTransaction,
      ]);
      return newTransaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  const deleteTransaction = (id: string) => {
    try {
      setTransactions((prevTransactions: any[]) =>
        prevTransactions.filter((t: any) => t.id !== id),
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  };

  const calculateTotals = () => {
    const totalIncome = transactions
      .filter((t: any) => t.type === "income")
      .reduce((acc: number, t: any) => acc + t.amount, 0);

    const totalExpenses = transactions
      .filter((t: any) => t.type === "expense")
      .reduce((acc: number, t: any) => acc + t.amount, 0);

    return {
      balance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
    };
  };

  const { balance, totalIncome, totalExpenses } = calculateTotals();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route
          index
          element={
            <Overview
              balance={balance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              recentTransactions={transactions.slice().reverse().slice(0, 5)}
            />
          }
        />
        <Route
          path="transactions"
          element={
            <>
              <TransactionForm onAddTransaction={addTransaction} />
              <TransactionList
                transactions={transactions}
                onDeleteTransaction={deleteTransaction}
              />
            </>
          }
        />
        <Route path="budget" element={<Budget transactions={transactions} />} />
        <Route
          path="reports"
          element={<Reports transactions={transactions} />}
        />
        <Route
          path="settings"
          element={
            <Settings
              currency={currency}
              setCurrency={setCurrency}
              transactions={transactions}
            />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
