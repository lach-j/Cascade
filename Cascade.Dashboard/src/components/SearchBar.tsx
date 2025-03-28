import { LuSearch } from "react-icons/lu";

type SearchBarProps = {
  onChange: (text: string) => void;
  placeholder?: string;
};

const SearchBar = ({ onChange, placeholder = "Search..." }: SearchBarProps) => {
  return (
    <div className="relative">
      <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
