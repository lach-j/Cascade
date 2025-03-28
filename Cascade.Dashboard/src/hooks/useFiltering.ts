import React from "react";

const useFiltering = <T>(items: T[], termSelector: (item: T) => string[]) => {
  const [filter, setFilter] = React.useState("");

  return {
    filter,
    setFilter,
    filteredItems: items.filter((item) =>
      termSelector(item).some((term) =>
        term.toLowerCase().includes(filter.toLowerCase())
      )
    ),
  };
};

export default useFiltering;
