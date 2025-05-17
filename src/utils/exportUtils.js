import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

export const generatePDF = (transactions, formatCurrency) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text("Expense Report", 14, 15);

  // Add date
  doc.setFontSize(12);
  doc.text(
    `Generated on: ${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
    14,
    25,
  );

  // Add summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 14, 35);
  doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 14, 45);
  doc.text(`Balance: ${formatCurrency(balance)}`, 14, 55);

  // Add transactions table
  const tableColumn = ["Date", "Description", "Category", "Type", "Amount"];
  const tableRows = transactions.map((transaction) => [
    moment(transaction.date).format("YYYY-MM-DD"),
    transaction.description,
    transaction.category,
    transaction.type,
    formatCurrency(transaction.amount),
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 65,
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Save the PDF
  doc.save("expense-report.pdf");
};

export const exportToCSV = (transactions, formatCurrency) => {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];

  const csvContent = [
    headers.join(","),
    ...transactions.map((transaction) =>
      [
        moment(transaction.date).format("YYYY-MM-DD"),
        `"${transaction.description}"`,
        transaction.category,
        transaction.type,
        transaction.amount,
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", "transactions.csv");
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
