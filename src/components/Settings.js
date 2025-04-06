import React, { useState } from 'react';
import './Settings.css';

const Settings = ({ currency, setCurrency }) => {
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [notifications, setNotifications] = useState(true);
  const [exportFormat, setExportFormat] = useState('csv');

  // Save currency preference to localStorage when it changes
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const handleExportData = () => {
    // TODO: Implement data export functionality
    alert('Export functionality coming soon!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-grid">
        <div className="settings-card preferences">
          <h2>Preferences</h2>
          <div className="settings-group">
            <label>Currency</label>
            <select value={currency} onChange={handleCurrencyChange}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          <div className="settings-group">
            <label>Date Format</label>
            <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div className="settings-group">
            <label>Notifications</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-card data">
          <h2>Data Management</h2>
          <div className="settings-group">
            <label>Export Format</label>
            <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <div className="settings-actions">
            <button className="export-btn" onClick={handleExportData}>
              Export Data
            </button>
            <button className="clear-btn" onClick={handleClearData}>
              Clear All Data
            </button>
          </div>
        </div>

        <div className="settings-card about">
          <h2>About</h2>
          <div className="about-content">
            <h3>Expense Tracker</h3>
            <p>Version 1.0.0</p>
            <p>A simple and intuitive expense tracking application to help you manage your finances.</p>
            <div className="links">
              <a href="#" className="link">Privacy Policy</a>
              <a href="#" className="link">Terms of Service</a>
              <a href="#" className="link">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 