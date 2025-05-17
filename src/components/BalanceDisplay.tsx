import React from "react";
import "./BalanceDisplay.css";

type BalanceDisplayProps = {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
};

const BalanceDisplay = ({
  balance,
  totalIncome,
  totalExpenses,
}: BalanceDisplayProps) => {
  return (
    <div className="balance-display">
      <div className="balance-card total">
        <h2>Current Balance</h2>
        <p className={`amount ${balance >= 0 ? "positive" : "negative"}`}>
          ${balance.toFixed(2)}
        </p>
      </div>

      <div className="summary">
        <div className="balance-card income">
          <h3>Total Income</h3>
          <p className="amount positive">+${totalIncome.toFixed(2)}</p>
        </div>

        <div className="balance-card expense">
          <h3>Total Expenses</h3>
          <p className="amount negative">-${totalExpenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceDisplay;
