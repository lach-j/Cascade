import React from "react";
import { LuCircleCheck, LuCircleDashed, LuLoaderCircle } from "react-icons/lu";
import useStyling from "../hooks/useStyling";

type Size = "sm" | "md" | "lg" | "xl";

type ToggleButtonProps = {
  action?: () => Promise<void> | void;
  isEnabled?: boolean;
  isReadOnly?: boolean;
  size?: Size;
  className?: string;
};

const ToggleButton = ({
  action,
  isEnabled = false,
  isReadOnly = false,
  size = "md",
  className,
}: ToggleButtonProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const styles = useStyling(
    {
      button: "flex items-center gap-2 rounded-lg",
      icon: "",
    },
    {
      size: {
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
      },
      state: {
        enabled: {
          button: "bg-green-100 text-green-700",
        },
        disabled: {
          button: "bg-gray-100 text-gray-700",
        },
      },
    }
  );

  const sizedStyles = styles.withSize(size);

  const hoverClass = isReadOnly
    ? ""
    : isEnabled
    ? "hover:bg-green-200"
    : "hover:bg-gray-200";

  const stateStyles = isEnabled
    ? styles.withState("enabled")
    : styles.withState("disabled");

  const handleClick = async () => {
    if (isReadOnly) return;

    setIsLoading(true);
    if (action) await action();
    setIsLoading(false);
  };

  return (
    <button
      disabled={isLoading || isReadOnly}
      className={styles.cx(
        styles.button,
        sizedStyles.button,
        stateStyles.button,
        hoverClass,
        className
      )}
      onClick={handleClick}
    >
      {isLoading ? (
        <LuLoaderCircle className={`${sizedStyles.icon} animate-spin`} />
      ) : isEnabled ? (
        <LuCircleCheck className={sizedStyles.icon} />
      ) : (
        <LuCircleDashed className={sizedStyles.icon} />
      )}
    </button>
  );
};

export default ToggleButton;
