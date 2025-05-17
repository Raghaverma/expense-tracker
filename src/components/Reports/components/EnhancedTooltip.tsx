import React from "react";

interface EnhancedTooltipProps {
  label: string;
  value: string | number;
  extra?: string;
}

// Placeholder for a custom tooltip component
export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  label,
  value,
  extra,
}) => (
  <div className="bg-white border border-gray-200 rounded shadow px-3 py-2 text-xs text-gray-800">
    <div className="font-semibold">{label}</div>
    <div>{value}</div>
    {extra && <div className="text-gray-400">{extra}</div>}
  </div>
);
