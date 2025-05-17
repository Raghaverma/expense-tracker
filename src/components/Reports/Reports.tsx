import React, { useRef, useMemo } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { trendConfig } from "./configs/trendConfig";
import { categoryConfig } from "./configs/categoryConfig";
import { ReportCard } from "./components/ReportCard";
import { ExportMenu } from "./components/ExportMenu";
import { exportToPDF, exportToCSV } from "./utils";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { ChartOptions } from "chart.js";

// Transaction type
interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string; // ISO string
  [key: string]: any;
}

interface ReportsProps {
  transactions: Transaction[];
}

const chartKeys = ["line", "doughnut", "bar"] as const;
type ChartKey = (typeof chartKeys)[number];

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  // Chart refs for export
  const chartRefs: Record<ChartKey, React.RefObject<any>> = {
    line: useRef(null),
    doughnut: useRef(null),
    bar: useRef(null),
  };

  // Aggregate data for charts
  const { lineData, doughnutData, barData } = useMemo(() => {
    // Group by month for line/bar
    const monthMap: Record<string, { income: number; expense: number }> = {};
    // Group by category for doughnut
    const categoryMap: Record<string, number> = {};
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (!monthMap[month]) monthMap[month] = { income: 0, expense: 0 };
      if (t.type === "income") monthMap[month].income += t.amount;
      if (t.type === "expense") monthMap[month].expense += t.amount;
      // Category
      if (t.type === "expense") {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    });
    const months = Object.keys(monthMap).sort(
      (a, b) => new Date("01 " + a).getTime() - new Date("01 " + b).getTime(),
    );
    // Line chart: Income vs Expenses
    const lineData = {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: months.map((m) => monthMap[m].income),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.2)",
        },
        {
          label: "Expenses",
          data: months.map((m) => monthMap[m].expense),
          borderColor: "#f87171",
          backgroundColor: "rgba(248,113,113,0.2)",
        },
      ],
    };
    // Bar chart: Monthly Savings
    const barData = {
      labels: months,
      datasets: [
        {
          label: "Savings",
          data: months.map((m) => monthMap[m].income - monthMap[m].expense),
          backgroundColor: [
            "#2563eb",
            "#fbbf24",
            "#34d399",
            "#f87171",
            "#a78bfa",
            "#f472b6",
            "#60a5fa",
            "#facc15",
            "#4ade80",
            "#fb7185",
          ],
          borderRadius: 6,
        },
      ],
    };
    // Doughnut chart: Category Distribution
    const catLabels = Object.keys(categoryMap);
    const doughnutData = {
      labels: catLabels,
      datasets: [
        {
          data: catLabels.map((c) => categoryMap[c]),
          backgroundColor: [
            "#2563eb",
            "#fbbf24",
            "#34d399",
            "#f87171",
            "#a78bfa",
            "#f472b6",
            "#60a5fa",
            "#facc15",
            "#4ade80",
            "#fb7185",
          ],
        },
      ],
    };
    return { lineData, doughnutData, barData };
  }, [transactions]);

  // Export all charts as PDF
  const handleExportAllPDF = () => {
    exportToPDF(
      chartKeys.map((key) => chartRefs[key].current),
      "All_Reports.pdf",
    );
  };

  // Export all charts as CSV
  const handleExportAllCSV = () => {
    exportToCSV([lineData, doughnutData, barData], "All_Reports.csv");
  };

  // Enhanced Bar chart options
  const barOptions: ChartOptions<"bar"> = {
    ...trendConfig,
    plugins: {
      ...trendConfig.plugins,
      datalabels: {
        anchor: "end",
        align: "end",
        color: "#222",
        font: { weight: "bold" },
        formatter: (value: number) => `${value}`,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `Savings: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      ...trendConfig.scales,
      y: {
        type: "linear",
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <div className="flex gap-2">
          {/* Filters/Dropdowns placeholder */}
          <select className="border rounded px-3 py-2">
            <option>Last 3 Months</option>
            <option>This Year</option>
            <option>Custom Range</option>
          </select>
          <ExportMenu
            onExportPDF={handleExportAllPDF}
            onExportCSV={handleExportAllCSV}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Line Chart: Income vs Expenses */}
        <ReportCard title="Income vs Expenses" fullscreen>
          <Line ref={chartRefs.line} data={lineData} options={trendConfig} />
        </ReportCard>
        {/* Bar Chart: Monthly Comparison */}
        <ReportCard title="Monthly Comparison" fullscreen>
          <Bar
            ref={chartRefs.bar}
            data={barData}
            options={barOptions}
            plugins={[ChartDataLabels]}
          />
        </ReportCard>
      </div>
      {/* Centered Category Distribution Chart */}
      <div className="flex justify-center my-8">
        <div className="w-full max-w-[90px]">
          <ReportCard title="Category Distribution" fullscreen>
            <div className="h-[75px] flex items-center justify-center">
              <Doughnut
                ref={chartRefs.doughnut}
                data={doughnutData}
                options={categoryConfig}
                width={75}
                height={75}
              />
            </div>
          </ReportCard>
        </div>
      </div>
    </div>
  );
};

export default Reports;
