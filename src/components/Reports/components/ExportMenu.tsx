import React from "react";

interface ExportMenuProps {
  chartTitle?: string;
  onExportPDF?: () => void;
  onExportCSV?: () => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  chartTitle,
  onExportPDF,
  onExportCSV,
}) => {
  return (
    <div className="flex gap-1">
      <button
        className="px-2 py-1 text-xs rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
        title={`Export ${chartTitle ? chartTitle + " " : ""}as PDF`}
        onClick={onExportPDF}
        type="button"
      >
        PDF
      </button>
      <button
        className="px-2 py-1 text-xs rounded bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
        title={`Export ${chartTitle ? chartTitle + " " : ""}as CSV`}
        onClick={onExportCSV}
        type="button"
      >
        CSV
      </button>
    </div>
  );
};
