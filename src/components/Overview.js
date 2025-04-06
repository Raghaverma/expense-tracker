import React from 'react';
import { Link } from 'react-router-dom';
import './Overview.css';

const Overview = ({ balance, totalIncome, totalExpenses, recentTransactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      rent: '🏠',
      utilities: '💡',
      food: '🍕',
      transport: '🚗',
      entertainment: '🎮',
      shopping: '🛍️',
      health: '⚕️',
      travel: '✈️',
      education: '📚',
      salary: '💰',
      investment: '📈',
      other: '📝'
    };
    return icons[category] || '📝';
  };

  return (
    <div className="overview">
      <div className="overview-header">
        <h1>Dashboard Overview</h1>
        <Link to="/dashboard/transactions" className="new-transaction-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Transaction
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card balance">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Current Balance</h3>
            <p className="stat-value">{formatCurrency(balance)}</p>
          </div>
        </div>
        <div className="stat-card income">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>Total Income</h3>
            <p className="stat-value">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        <div className="stat-card expenses">
          <div className="stat-icon">📉</div>
          <div className="stat-info">
            <h3>Total Expenses</h3>
            <p className="stat-value">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="recent-transactions card">
          <div className="card-header">
            <h2>Recent Transactions</h2>
            <Link to="/dashboard/transactions" className="view-all">View All</Link>
          </div>
          <div className="transaction-list">
            {recentTransactions?.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                <div className="transaction-icon">
                  {getCategoryIcon(transaction.category)}
                </div>
                <div className="transaction-info">
                  <h4>{transaction.description}</h4>
                  <span className="transaction-date">{formatDate(transaction.date)}</span>
                </div>
                <div className="transaction-amount">
                  {transaction.type === 'expense' ? '- ' : '+ '}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="spending-chart card">
          <div className="card-header">
            <h2>Spending by Category</h2>
            <select className="period-select">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="chart-placeholder">
            {/* Add your chart component here */}
            <div className="placeholder-text">Chart Coming Soon</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <div className="card">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/dashboard/budget" className="action-item">
              <div className="action-icon">📊</div>
              <span>Set Budget</span>
            </Link>
            <Link to="/dashboard/reports" className="action-item">
              <div className="action-icon">📈</div>
              <span>View Reports</span>
            </Link>
            <Link to="/dashboard/settings" className="action-item">
              <div className="action-icon">⚙️</div>
              <span>Settings</span>
            </Link>
            <Link to="/dashboard/transactions" className="action-item">
              <div className="action-icon">📝</div>
              <span>All Transactions</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 