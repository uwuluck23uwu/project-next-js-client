"use client";

import { useSearchParams } from "next/navigation";
import { FromItem } from "@/components";
import { useGetShirtStylesQuery } from "@/stores/api/shirtstyle.api";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading, isError } = useGetShirtStylesQuery({
    pageSize: 10,
    currentPage: 1,
    search: query,
  });

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">ผลการค้นหา: {query}</h1>
      <FromItem data={data} isLoading={isLoading} isError={isError} />
    </div>
  );
};

export default SearchPage;
