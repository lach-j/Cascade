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
    <div className="flex items-center gap-2">
      <code className="bg-gray-800 text-orange-300 px-2 py-0.5 rounded font-mono text-sm">
        {children}
      </code>
      <button
        onClick={() => handleCopy(children)}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
        aria-label="Copy code"
      >
        {copied ? (
          <LuCheck className="w-4 h-4 text-green-500" />
        ) : (
          <LuCopy className="w-4 h-4 text-gray-500" />
        )}
      </button>
    </div>
  );
};

export default Code;
