import React, { useState, useEffect } from 'react';
import './Budget.css';

const Budget = ({ transactions }) => {
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : {};
  });

  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const categories = [
    'rent', 'utilities', 'food', 'transport', 'entertainment',
    'shopping', 'health', 'travel', 'education', 'other'
  ];

  const calculateSpentAmount = (category) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const handleSetBudget = (e) => {
    e.preventDefault();
    if (newCategory && newAmount) {
      setBudgets(prev => ({
        ...prev,
        [newCategory]: parseFloat(newAmount)
      }));
      setNewCategory('');
      setNewAmount('');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateProgress = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  return (
    <div className="budget-page">
      <div className="budget-header">
        <h1>Budget Management</h1>
        <form className="budget-form" onSubmit={handleSetBudget}>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="Enter budget amount"
            min="0"
            step="0.01"
            required
          />
          <button type="submit" className="set-budget-btn">Set Budget</button>
        </form>
      </div>

      <div className="budget-grid">
        {categories.map(category => {
          const budget = budgets[category] || 0;
          const spent = calculateSpentAmount(category);
          const progress = calculateProgress(spent, budget);
          const remaining = Math.max(budget - spent, 0);

          return (
            <div key={category} className="budget-card">
              <div className="budget-card-header">
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <span className="budget-amount">{formatCurrency(budget)}</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: progress >= 100 ? 'var(--danger-color)' : 'var(--primary-color)'
                  }}
                ></div>
              </div>
              <div className="budget-details">
                <div className="budget-detail">
                  <span>Spent</span>
                  <span className="spent">{formatCurrency(spent)}</span>
                </div>
                <div className="budget-detail">
                  <span>Remaining</span>
                  <span className="remaining">{formatCurrency(remaining)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budget; 