import React, { useState } from "react";
import "./TransactionList.css";
import Pagination from "./Pagination";

type Transaction = {
  id: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  [key: string]: any;
};

type TransactionListProps = {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
};

const TransactionList = ({
  transactions,
  onDeleteTransaction,
}: TransactionListProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [filter, setFilter] = useState<string>("all");

  const filteredTransactions = transactions.filter(
    (transaction: Transaction) => {
      if (filter === "all") return true;
      return transaction.type === filter;
    },
  );

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      rent: "🏠",
      utilities: "💡",
      food: "🍕",
      transport: "🚗",
      entertainment: "🎮",
      shopping: "🛍️",
      health: "⚕️",
      travel: "✈️",
      education: "📚",
      salary: "💰",
      investment: "📈",
      other: "📝",
    };
    return icons[category] || "📝";
  };

  return (
    <div className="transaction-list">
      <div className="transaction-list-header">
        <h2 className="transaction-list-title">Recent Transactions</h2>
        <div className="transaction-filters">
          <button
            className={`filter-button ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-button ${filter === "income" ? "active" : ""}`}
            onClick={() => setFilter("income")}
          >
            Income
          </button>
          <button
            className={`filter-button ${filter === "expense" ? "active" : ""}`}
            onClick={() => setFilter("expense")}
          >
            Expense
          </button>
        </div>
      </div>

      {currentTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p className="empty-state-text">No transactions found</p>
        </div>
      ) : (
        <>
          {currentTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className={`transaction-icon ${transaction.category}`}>
                {getCategoryIcon(transaction.category)}
              </div>
              <div className="transaction-details">
                <h3 className="transaction-title">{transaction.description}</h3>
                <p className="transaction-date">
                  {formatDate(transaction.date)}
                </p>
              </div>
              <span className={`transaction-amount ${transaction.type}`}>
                {transaction.type === "expense" ? "-" : "+"}
                {formatAmount(transaction.amount)}
              </span>
              <div className="transaction-actions">
                <button
                  className="action-button"
                  onClick={() => {
                    /* Edit function */
                  }}
                  title="Edit transaction"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button
                  className="action-button delete"
                  onClick={() => onDeleteTransaction(transaction.id)}
                  title="Delete transaction"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}
    </div>
  );
};

export default TransactionList;
