import React from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

const Code = ({ children }: { children: string }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center bg-gray-800 text-orange-300 rounded">
      <code className="pl-2 py-0.5 font-mono text-sm">{children}</code>
      <button
        onClick={() => handleCopy(children)}
        className="p-1.5 rounded transition-colors group"
        aria-label="Copy code"
      >
        {copied ? (
          <LuCheck className="w-4 h-4 text-green-500" />
        ) : (
          <LuCopy className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
        )}
      </button>
    </div>
  );
};

export default Code;
