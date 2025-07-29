"use client";
import {
  createContext,
  useState,
  ReactNode,
  useContext as useGetContext,
} from "react";

interface ContextType {
  id: string | null;
  setId: (id: string) => void;
};

const ShirtContext = createContext<ContextType>({
  id: null,
  setId: () => {},
});

export const useContext = () => useGetContext(ShirtContext);

export function ContextProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);

  return (
    <ShirtContext.Provider value={{ id, setId }}>
      {children}
    </ShirtContext.Provider>
  );
}
