import { Suspense } from "react";
import { Loader } from "@/components";
import SearchPage from "./SearchPage";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchPage />
    </Suspense>
  );
}
