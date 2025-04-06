import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import Overview from './components/Overview';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Budget from './components/Budget';
import Reports from './components/Reports';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('currency');
    return savedCurrency || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const formatCurrency = (amount) => {
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      INR: '₹'
    };

    const currencyFormats = {
      USD: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      EUR: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      GBP: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      JPY: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
      INR: { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    };

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      ...currencyFormats[currency]
    }).format(amount);
  };

  const addTransaction = (transaction) => {
    try {
      const newTransaction = {
        ...transaction,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat(transaction.amount),
        date: new Date(transaction.date).toISOString()
      };

      if (!newTransaction.amount || isNaN(newTransaction.amount)) {
        throw new Error('Invalid amount');
      }
      if (!newTransaction.description) {
        throw new Error('Description is required');
      }
      if (!newTransaction.category) {
        throw new Error('Category is required');
      }

      setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = (id) => {
    try {
      setTransactions(prevTransactions => 
        prevTransactions.filter(t => t.id !== id)
      );
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const calculateTotals = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    return {
      balance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses
    };
  };

  const { balance, totalIncome, totalExpenses } = calculateTotals();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={
          <Overview
            balance={balance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            recentTransactions={transactions.slice().reverse().slice(0, 5)}
            formatCurrency={formatCurrency}
          />
        } />
        <Route path="transactions" element={
          <>
            <TransactionForm onAddTransaction={addTransaction} />
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={deleteTransaction}
              formatCurrency={formatCurrency}
            />
          </>
        } />
        <Route path="budget" element={<Budget transactions={transactions} formatCurrency={formatCurrency} />} />
        <Route path="reports" element={<Reports transactions={transactions} formatCurrency={formatCurrency} />} />
        <Route path="settings" element={
          <Settings 
            currency={currency}
            setCurrency={setCurrency}
          />
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
