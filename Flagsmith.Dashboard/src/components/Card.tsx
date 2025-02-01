import React from "react";

export type Stylable = { className?: string };

const Card = ({
  children,
  className,
  ...props
}: React.PropsWithChildren<
  Stylable & Pick<React.HtmlHTMLAttributes<HTMLDivElement>, "onClick">
>) => {
  return (
    <div {...props} className={`bg-white shadow rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({
  children,
  className,
}: React.PropsWithChildren<Stylable>) => {
  return <div className={`${className}`}>{children}</div>;
};

const CardTitle = ({
  children,
  className,
}: React.PropsWithChildren<Stylable>) => {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
};

const CardContent = ({
  children,
  className,
}: React.PropsWithChildren<Stylable>) => {
  return <div className={`${className}`}>{children}</div>;
};

const CardDescription = ({
  children,
  className,
}: React.PropsWithChildren<Stylable>) => {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
};

export { Card, CardHeader, CardTitle, CardContent, CardDescription };
