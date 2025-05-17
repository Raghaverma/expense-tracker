import React, { useState, ReactNode, useRef } from "react";
import { ExportMenu } from "./ExportMenu";

interface ReportCardProps {
  title: string;
  children: ReactNode;
  fullscreen?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  title,
  children,
  fullscreen = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => {
      if (cardRef.current && !isFullscreen) {
        cardRef.current.requestFullscreen?.();
      } else if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }, 0);
  };

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-lg shadow p-4 relative transition-all ${isFullscreen ? "fixed inset-0 z-50 m-0 p-8 bg-gray-100" : ""}`}
      style={isFullscreen ? { height: "100vh", width: "100vw" } : {}}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex gap-2">
          <button
            className="text-gray-400 hover:text-blue-600 p-1"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            onClick={handleFullscreen}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {isFullscreen ? (
                <path d="M9 15H5v-4M15 9h4v4" />
              ) : (
                <path d="M4 4h7V2H2v9h2V4zm16 0v7h2V2h-9v2h7zm0 16h-7v2h9v-9h-2v7zm-16 0v-7H2v9h9v-2H4z" />
              )}
            </svg>
          </button>
          <ExportMenu chartTitle={title} />
        </div>
      </div>
      <div className="h-16 md:h-20 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
