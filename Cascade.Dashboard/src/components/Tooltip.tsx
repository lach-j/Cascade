import React from "react";

type TooltipProps = {
  children: React.ReactNode;
  text: string;
};

const Tooltip = ({ children, text }: TooltipProps) => {
  return (
    <div className="relative group">
      {children}
      <div className="min-w-50 max-w-100 whitespace-normal absolute bg-stone-700 text-white text-xs rounded-sm py-2 px-4 hidden opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-1 z-10 group-hover:block transition-discrete">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
