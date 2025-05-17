import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Utility: Format a number as currency
export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );
}

// Utility: Export chart(s) as PDF using html2canvas and jsPDF
export async function exportToPDF(
  elements: (HTMLElement | null)[],
  filename: string,
) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  let y = 20;
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (!el) continue;
    const canvas = await html2canvas(el, { backgroundColor: "#fff", scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 20, y, pdfWidth, pdfHeight);
  }
  pdf.save(filename);
}

// Utility: Export chart data as CSV
export function exportToCSV(data: any[], filename: string) {
  if (!data.length) return;
  // Flatten and format data for CSV
  let csv = "";
  data.forEach((chart, idx) => {
    if (!chart || !chart.labels || !chart.datasets) return;
    csv += `Chart ${idx + 1}\n`;
    csv +=
      ["Label", ...chart.datasets.map((ds: any) => ds.label || "Value")].join(
        ",",
      ) + "\n";
    for (let i = 0; i < chart.labels.length; i++) {
      const row = [
        chart.labels[i],
        ...chart.datasets.map((ds: any) => ds.data[i]),
      ];
      csv += row.join(",") + "\n";
    }
    csv += "\n";
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
