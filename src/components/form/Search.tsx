"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components";

interface SearchProps {
  onSearch?: (query: string) => void;
};

const Search = ({ onSearch }: SearchProps) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const debounceSearch = useCallback(
    debounce((value: string) => {
      if (onSearch) onSearch(value);
    }, 1000),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debounceSearch(value);
  };

  const handleSubmit = () => {
    if (query.trim() !== "") {
      router.push(`/shirtstyle/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex items-center max-w-md mx-auto bg-white border border-gray-300 rounded-full p-2 shadow-sm">
      <SearchIcon className="w-5 h-5 text-gray-500" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="ml-2 w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
        placeholder="ค้นหา..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <Button
        icon={<SearchIcon className="w-4 h-4" />}
        onClick={handleSubmit}
        style={{
          borderRadius: "50%",
          height: "40px",
        }}
      />
    </div>
  );
};

export default Search;
