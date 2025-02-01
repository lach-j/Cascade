import React from "react";
import { NavLink, useLocation } from "react-router";

type TabsProps = {
  initialActiveTab?: string;
};
const NavigationTabs = ({ children }: React.PropsWithChildren<TabsProps>) => {
  return (
    <div className="w-full mb-3">
      <div className="flex border-b border-gray-200">{children}</div>
    </div>
  );
};

type TabProps = {
  route: string;
};
export const NavTab = ({
  route,
  children,
}: React.PropsWithChildren<TabProps>) => {
  const { pathname } = useLocation();

  return (
    <NavLink
      to={route}
      className={`
        px-4 py-2 text-sm font-medium 
        transition-colors duration-200
        ${
          pathname === route
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }
      `}
    >
      {children}
    </NavLink>
  );
};

export default NavigationTabs;
