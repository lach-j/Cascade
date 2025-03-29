import React from "react";
import useTailwindStyles from "../hooks/useStyling";

export type Stylable = { className?: string };

const Card = ({
  children,
  className,
  ...props
}: React.PropsWithChildren<
  Stylable & Pick<React.HtmlHTMLAttributes<HTMLDivElement>, "onClick">
>) => {

  const styles = useTailwindStyles({
    card: "bg-white shadow rounded-lg p-4",
  });

  const clickableStyles = styles.cardIf(!!props.onClick, 'shadow-sm cursor-pointer hover:shadow-md transition-shadow');

  return (
    <div {...props} className={styles.cx(styles.card, clickableStyles, className)}>
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
  ...props
}: React.PropsWithChildren<Stylable & React.HtmlHTMLAttributes<HTMLParagraphElement>>) => {
  return <p {...props} className={`text-sm text-gray-500 ${className}`}>{children}</p>;
};

export { Card, CardHeader, CardTitle, CardContent, CardDescription };
