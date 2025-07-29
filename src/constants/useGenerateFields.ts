import { useMemo } from "react";

const useGenerateFields = (
  columnMapping: Record<string, string>,
  includes: string[]
) => {
  return useMemo(() => {
    return Object.keys(columnMapping)
      .filter((col) => includes.includes(col))
      .map((col) => {
        if (col === "รูปภาพ") {
          return {
            name: columnMapping[col],
            type: "array",
            placeholder: col,
            inputType: "upload",
          };
        }
        if (col === "ขนาด") {
          return {
            name: columnMapping[col],
            type: "array",
            placeholder: col,
            inputType: "select",
          };
        }
        return {
          name: columnMapping[col],
          type: "text",
          placeholder: col,
        };
      });
  }, [columnMapping, includes]);
};

export default useGenerateFields;
