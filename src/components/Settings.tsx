import React, { useState } from "react";
import "./Settings.css";
import { exportToCSV } from "./Reports/utils";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  [key: string]: any;
}

interface SettingsProps {
  currency: string;
  setCurrency: (currency: string) => void;
  transactions: Transaction[];
}

const Settings: React.FC<SettingsProps> = ({
  currency,
  setCurrency,
  transactions,
}) => {
  const [dateFormat, setDateFormat] = useState<string>("MM/DD/YYYY");
  const [notifications, setNotifications] = useState<boolean>(true);
  const [exportFormat, setExportFormat] = useState<string>("csv");

  // Save currency preference to localStorage when it changes
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const handleExportData = () => {
    if (exportFormat === "csv") {
      exportToCSV(transactions, "All_Transactions.csv");
    } else if (exportFormat === "json") {
      const blob = new Blob([JSON.stringify(transactions, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "All_Transactions.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.text("All Transactions", 10, 10);
      const headers = [["Date", "Type", "Category", "Amount", "Description"]];
      const rows = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.category,
        t.amount,
        t.description || "",
      ]);
      // @ts-ignore
      if (doc.autoTable) {
        // @ts-ignore
        doc.autoTable({ head: headers, body: rows, startY: 20 });
      } else {
        rows.forEach((row, i) => {
          doc.text(row.join(" | "), 10, 20 + i * 10);
        });
      }
      doc.save("All_Transactions.pdf");
    }
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone.",
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExportAllCSV = () => {
    exportToCSV(transactions, "All_Transactions.csv");
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
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
            >
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
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
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
            <p>
              A simple and intuitive expense tracking application to help you
              manage your finances.
            </p>
            <div className="links">
              <a href="#" className="link">
                Privacy Policy
              </a>
              <a href="#" className="link">
                Terms of Service
              </a>
              <a href="#" className="link">
                Contact Support
              </a>
            </div>
          </div>
        </div>

        <div className="settings-card export-all">
          <h2>Export All Transactions</h2>
          <div className="settings-group">
            <button className="export-all-btn" onClick={handleExportAllCSV}>
              Export All Transactions as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
