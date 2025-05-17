import { ChartOptions } from "chart.js";

// Category distribution chart config (Doughnut/Pie)
export const categoryConfig: ChartOptions<"doughnut"> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (ctx) => `${ctx.label}: $${ctx.parsed}`,
      },
    },
    title: {
      display: false,
    },
  },
};
