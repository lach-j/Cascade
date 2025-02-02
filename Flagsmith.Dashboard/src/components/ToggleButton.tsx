import React from "react";
import { LuCircleCheck, LuCircleDashed, LuLoaderCircle } from "react-icons/lu";

const sizeStyles = {
  sm: {
    button: "px-1.5 py-1.5",
    icon: "w-4 h-4",
  },
  md: {
    button: "px-2 py-2",
    icon: "w-5 h-5",
  },
  lg: {
    button: "px-3 py-3",
    icon: "w-6 h-6",
  },
  xl: {
    button: "px-4 py-4",
    icon: "w-9 h-9",
  },
};

type ToggleButtonProps = {
  action?: () => Promise<void>;
  isEnabled?: boolean;
  size?: keyof typeof sizeStyles;
};

const ToggleButton = ({
  action,
  isEnabled = false,
  size = "md",
}: ToggleButtonProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <button
      disabled={isLoading}
      className={`flex items-center gap-2 ${
        sizeStyles[size].button
      } rounded-lg ${
        isEnabled
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={async () => {
        setIsLoading(true);
        if (action) await action();
        setIsLoading(false);
      }}
    >
      {isLoading ? (
        <LuLoaderCircle className={`${sizeStyles[size].icon} animate-spin`} />
      ) : isEnabled ? (
        <>
          <LuCircleCheck className={sizeStyles[size].icon} />
        </>
      ) : (
        <>
          <LuCircleDashed className={sizeStyles[size].icon} />
        </>
      )}
    </button>
  );
};

export default ToggleButton;
