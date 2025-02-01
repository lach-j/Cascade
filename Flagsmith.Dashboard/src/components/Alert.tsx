const Alert = ({
  children,
  className,
  icon,
}: {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={`text-yellow-700 bg-yellow-50 border-l-4 border-yellow-400 p-4 flex gap-4 items-center ${className}`}
    >
      {icon}
      {children}
    </div>
  );
};

export default Alert;
