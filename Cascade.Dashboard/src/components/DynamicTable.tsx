export type ColumnDefinition<T> = {
  Cell: (props: { item: T }) => React.ReactNode;
  heading?: React.ReactNode;
  className?: string;
  shrink?: boolean;
};

type DynamicTableProps<T> = {
  items: T[];
  columns: ColumnDefinition<T>[];
  className?: string;
};

const DynamicTable = <T,>({
  items,
  columns,
  className = "",
}: DynamicTableProps<T>) => {
  return (
    <div className={`w-full ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className={columns.some((c) => !!c.heading) ? `border-b` : ""}>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`p-4 text-left font-medium text-gray-700 
                    ${column.shrink ? "w-0 whitespace-nowrap" : ""} 
                    ${column.className || ""}`}
              >
                {column.heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(({ Cell, className, shrink }, colIndex) => (
                <td
                  key={colIndex}
                  className={`p-4 
                      ${shrink ? "w-0 whitespace-nowrap" : ""} 
                      ${className || ""}`}
                >
                  <Cell item={item} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
