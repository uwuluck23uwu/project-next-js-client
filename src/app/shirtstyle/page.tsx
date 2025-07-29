"use client";

import { Box } from "@mui/material";
import { FromItem } from "@/components";
import { useGetShirtStylesQuery } from "@/stores/api/shirtstyle.api";

const ShirtStylePage = () => {
  const { data, isLoading, isError } = useGetShirtStylesQuery({
    pageSize: 10,
    currentPage: 1,
  });

  return <FromItem data={data} isLoading={isLoading} isError={isError} />;
};

export default ShirtStylePage;
