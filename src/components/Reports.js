import React, { useState, useRef, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PolarAreaController,
  BubbleController,
  ScatterController,
  TimeScale,
} from 'chart.js';
import { Line, Bar, Doughnut, PolarArea, Bubble, Scatter } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'chartjs-adapter-moment';
import './Reports.css';
import { Download, Maximize2, Minimize2, ChevronDown } from 'lucide-react';
import { getChartOptions, getChartData } from './chartConfig';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PolarAreaController,
  BubbleController,
  ScatterController,
  TimeScale
);

const Reports = ({ transactions, formatCurrency }) => {
  const [timeframe, setTimeframe] = useState('month');
  const [selectedChart, setSelectedChart] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const reportsRef = useRef(null);
  const chartRefs = {
    trend: useRef(null),
    category: useRef(null),
    monthly: useRef(null),
    polar: useRef(null),
    bubble: useRef(null),
    scatter: useRef(null)
  };
  const [showExportMenu, setShowExportMenu] = useState(false);

  const chartOptions = useMemo(() => getChartOptions(timeframe), [timeframe]);
  const chartData = useMemo(() => 
    getChartData(transactions, timeframe, formatCurrency), 
    [transactions, timeframe, formatCurrency]
  );

  const getFilteredTransactions = () => {
    const now = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    return transactions.filter(t => new Date(t.date) >= startDate);
  };

  const calculateCategoryTotals = () => {
    const filtered = getFilteredTransactions();
    return filtered.reduce((acc, t) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    }, {});
  };

  const calculateDailyTotals = () => {
    const filtered = getFilteredTransactions();
    const dailyTotals = filtered.reduce((acc, t) => {
      const date = t.date.split('T')[0];
      if (t.type === 'expense') {
        acc.expenses[date] = (acc.expenses[date] || 0) + t.amount;
      } else {
        acc.income[date] = (acc.income[date] || 0) + t.amount;
      }
      return acc;
    }, { expenses: {}, income: {} });

    // Get all unique dates
    const dates = [...new Set([
      ...Object.keys(dailyTotals.expenses),
      ...Object.keys(dailyTotals.income)
    ])].sort();

    return {
      labels: dates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      expenses: dates.map(date => dailyTotals.expenses[date] || 0),
      income: dates.map(date => dailyTotals.income[date] || 0)
    };
  };

  const calculateMonthlyTotals = () => {
    const filtered = getFilteredTransactions();
    const monthlyTotals = filtered.reduce((acc, t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (t.type === 'expense') {
        acc.expenses[monthKey] = (acc.expenses[monthKey] || 0) + t.amount;
      } else {
        acc.income[monthKey] = (acc.income[monthKey] || 0) + t.amount;
      }
      return acc;
    }, { expenses: {}, income: {} });

    // Get all unique months
    const months = [...new Set([
      ...Object.keys(monthlyTotals.expenses),
      ...Object.keys(monthlyTotals.income)
    ])].sort();

    return {
      labels: months.map(month => {
        const [year, monthNum] = month.split('-');
        return new Date(year, monthNum - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      expenses: months.map(month => monthlyTotals.expenses[month] || 0),
      income: months.map(month => monthlyTotals.income[month] || 0)
    };
  };

  const categoryTotals = calculateCategoryTotals();
  const dailyTotals = calculateDailyTotals();
  const monthlyTotals = calculateMonthlyTotals();

  // Chart configurations
  const spendingTrendConfig = {
    data: {
      labels: timeframe === 'year' ? monthlyTotals.labels : dailyTotals.labels,
      datasets: [
        {
          label: 'Income',
          data: timeframe === 'year' ? monthlyTotals.income : dailyTotals.income,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: timeframe === 'year' ? monthlyTotals.expenses : dailyTotals.expenses,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Income vs Expenses Trend'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        }
      }
    }
  };

  const categoryChartConfig = {
    data: {
      labels: Object.keys(categoryTotals).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: 'Spending by Category'
        }
      }
    }
  };

  const exportChart = (chartType) => {
    const chartRef = chartRefs[chartType];
    if (chartRef && chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.download = `${chartType}-chart.png`;
      link.href = url;
      link.click();
    }
  };

  const polarChartConfig = {
    data: {
      labels: Object.keys(categoryTotals).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        }
      },
      plugins: {
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: 'Category Distribution (Polar)'
        }
      }
    }
  };

  const exportToPDF = async () => {
    const element = reportsRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('expense-reports.pdf');
  };

  const toggleFullscreen = (chartType) => {
    const chartContainer = chartRefs[chartType].current?.canvas.parentElement;
    if (chartContainer) {
      if (!document.fullscreenElement) {
        chartContainer.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleChartHover = (event, elements, chart) => {
    if (elements.length > 0) {
      const tooltipData = elements[0];
      setActiveTooltip({
        x: tooltipData.element.x,
        y: tooltipData.element.y,
        value: tooltipData.element.parsed.y,
        label: tooltipData.dataset.label
      });
    } else {
      setActiveTooltip(null);
    }
  };

  // New chart configurations
  const bubbleChartConfig = {
    data: {
      datasets: Object.entries(categoryTotals).map(([category, amount], index) => ({
        label: category.charAt(0).toUpperCase() + category.slice(1),
        data: [{
          x: index,
          y: amount,
          r: Math.sqrt(amount) / 10
        }],
        backgroundColor: `hsla(${index * 40}, 70%, 50%, 0.7)`
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
          }
        },
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: 'Spending Distribution (Bubble)'
        }
      }
    }
  };

  const scatterChartConfig = {
    data: {
      datasets: [{
        label: 'Expenses',
        data: getFilteredTransactions()
          .filter(t => t.type === 'expense')
          .map(t => ({
            x: new Date(t.date).getTime(),
            y: t.amount
          })),
        backgroundColor: 'rgba(255, 99, 132, 0.7)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: timeframe === 'week' ? 'day' : timeframe === 'month' ? 'week' : 'month',
            displayFormats: {
              day: 'MMM D',
              week: 'MMM D',
              month: 'MMM YYYY'
            }
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          },
          title: {
            display: true,
            text: 'Amount'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => formatCurrency(context.parsed.y),
            title: (tooltipItems) => {
              const date = new Date(tooltipItems[0].parsed.x);
              return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            }
          }
        },
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Expense Distribution Over Time'
        }
      }
    }
  };

  // Add cleanup effect
  React.useEffect(() => {
    return () => {
      // Destroy all charts on component unmount
      Object.values(chartRefs).forEach(ref => {
        if (ref.current) {
          ref.current.destroy();
        }
      });
    };
  }, []);

  // Add effect to destroy charts when switching between them
  React.useEffect(() => {
    if (selectedChart !== 'all') {
      Object.entries(chartRefs).forEach(([type, ref]) => {
        if (type !== selectedChart && ref.current) {
          ref.current.destroy();
        }
      });
    }
  }, [selectedChart]);

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  React.useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className={`reports-page ${isFullscreen ? 'fullscreen' : ''}`} ref={reportsRef}>
      <div className="reports-header">
        <h1>Spending Reports</h1>
        <div className="reports-controls">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="timeframe-select"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="chart-select"
          >
            <option value="all">All Charts</option>
            <option value="trend">Spending Trend</option>
            <option value="category">Category Distribution</option>
            <option value="monthly">Monthly Comparison</option>
            <option value="polar">Category Distribution (Polar)</option>
            <option value="bubble">Spending Distribution (Bubble)</option>
            <option value="scatter">Expense Timeline (Scatter)</option>
          </select>
          <div className="export-dropdown">
            <button 
              className="export-button"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={16} />
              Export
              <ChevronDown size={14} />
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <button onClick={() => exportChart('trend')}>
                  Income vs Expenses Trend
                </button>
                <button onClick={() => exportChart('category')}>
                  Spending by Category
                </button>
                <button onClick={() => exportChart('monthly')}>
                  Monthly Comparison
                </button>
                <button onClick={() => exportChart('polar')}>
                  Category Distribution (Polar)
                </button>
                <button onClick={() => exportChart('bubble')}>
                  Spending Distribution (Bubble)
                </button>
                <button onClick={() => exportChart('scatter')}>
                  Expense Timeline
                </button>
                <button onClick={exportToPDF}>
                  Export All as PDF
                </button>
              </div>
            )}
          </div>
          <button
            className="fullscreen-button"
            onClick={() => toggleFullscreen('all')}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {isFullscreen ? "Exit" : "Fullscreen"}
          </button>
        </div>
      </div>

      <div className="reports-grid">
        {(selectedChart === 'all' || selectedChart === 'trend') && (
          <div className="report-card spending-trend">
            <h2>Income vs Expenses Trend</h2>
            <div className="chart-container">
              <Line ref={chartRefs.trend} {...spendingTrendConfig} />
            </div>
          </div>
        )}

        {(selectedChart === 'all' || selectedChart === 'category') && (
          <div className="report-card category-distribution">
            <h2>Spending by Category</h2>
            <div className="chart-container">
              <Doughnut ref={chartRefs.category} {...categoryChartConfig} />
            </div>
          </div>
        )}

        {(selectedChart === 'all' || selectedChart === 'monthly') && (
          <div className="report-card monthly-comparison">
            <h2>Monthly Comparison</h2>
            <div className="chart-container">
              <Bar
                ref={chartRefs.monthly}
                data={{
                  labels: monthlyTotals.labels.slice(-6),
                  datasets: [
                    {
                      label: 'Income',
                      data: monthlyTotals.income.slice(-6),
                      backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    },
                    {
                      label: 'Expenses',
                      data: monthlyTotals.expenses.slice(-6),
                      backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Last 6 Months'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value)
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {(selectedChart === 'all' || selectedChart === 'polar') && (
          <div className="report-card polar-distribution">
            <h2>Category Distribution (Polar)</h2>
            <div className="chart-container">
              <PolarArea ref={chartRefs.polar} {...polarChartConfig} />
            </div>
          </div>
        )}

        {(selectedChart === 'all' || selectedChart === 'bubble') && (
          <div className="report-card bubble-distribution">
            <h2>Spending Distribution (Bubble)</h2>
            <div className="chart-container">
              <Bubble
                ref={chartRefs.bubble}
                {...bubbleChartConfig}
                onHover={handleChartHover}
              />
            </div>
          </div>
        )}

        {(selectedChart === 'all' || selectedChart === 'scatter') && (
          <div className="report-card scatter-plot">
            <h2>Expense Timeline</h2>
            <div className="chart-container">
              <Scatter
                ref={chartRefs.scatter}
                {...scatterChartConfig}
                onHover={handleChartHover}
              />
            </div>
          </div>
        )}

        {activeTooltip && (
          <div
            className="enhanced-tooltip"
            style={{
              position: 'fixed',
              left: activeTooltip.x + 10,
              top: activeTooltip.y + 10
            }}
          >
            <strong>{activeTooltip.label}</strong>
            <span>{formatCurrency(activeTooltip.value)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports; 