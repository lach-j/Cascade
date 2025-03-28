import React from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";

type MenuProps = {
  children: {
    trigger: React.ReactNode;
    items: React.ReactNode;
  };
};

const Menu = ({ children: { items, trigger } }: MenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle Menu"
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      >
        {trigger}
      </button>
      <div
        className={`
            absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-10
            transition-all duration-200 ease-in-out transform
            ${
              isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }
          `}
      >
        {items}
      </div>
    </div>
  );
};

export { Menu };
