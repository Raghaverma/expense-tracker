import { format } from "date-fns";

interface Transaction {
  date: string;
  amount: number;
  [key: string]: any;
}

export const getChartOptions = (timeframe: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
      backgroundColor: "hsl(var(--background))",
      titleColor: "hsl(var(--foreground))",
      bodyColor: "hsl(var(--foreground))",
      borderColor: "hsl(var(--border))",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: function (context: any) {
          return context.parsed.y.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: "hsl(var(--muted-foreground))",
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: timeframe === "year" ? 12 : 7,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "hsl(var(--border))",
        drawBorder: false,
      },
      ticks: {
        color: "hsl(var(--muted-foreground))",
        callback: (value: number) =>
          value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
      },
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
});

export const getChartData = (
  transactions: Transaction[],
  timeframe: string,
  formatCurrency: (amount: number) => string,
) => {
  const now = new Date();
  const filteredTransactions = transactions.filter(
    (transaction: Transaction) => {
      const transactionDate = new Date(transaction.date);
      const diffTime = Math.abs(now.getTime() - transactionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (timeframe) {
        case "week":
          return diffDays <= 7;
        case "month":
          return diffDays <= 30;
        case "year":
          return diffDays <= 365;
        default:
          return true;
      }
    },
  );

  const dates: string[] = [];
  const amounts: number[] = [];

  filteredTransactions.forEach((transaction: Transaction) => {
    const date = new Date(transaction.date);
    const formattedDate = format(date, "MMM d");
    dates.push(formattedDate);
    amounts.push(transaction.amount);
  });

  return {
    labels: dates,
    datasets: [
      {
        label: "Expenses",
        data: amounts,
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "hsl(var(--primary))",
        pointBorderColor: "hsl(var(--background))",
        pointBorderWidth: 2,
      },
    ],
  };
};
