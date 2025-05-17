import { ChartOptions } from "chart.js";

// Trend chart config (Line/Bar)
export const trendConfig: ChartOptions<"line" | "bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y}`,
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Month",
      },
    },
    y: {
      title: {
        display: true,
        text: "Amount ($)",
      },
      beginAtZero: true,
    },
  },
};
