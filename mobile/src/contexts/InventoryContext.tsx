import React, { createContext, useCallback, useContext, useState } from "react";
import { Batch, Summary } from "../types";
import { api } from "../services/api";
const initial = { lots: 0, units: 0, atRisk: 0, expired: 0, urgent: 0 };
type Inventory = {
  batches: Batch[];
  summary: Summary;
  loading: boolean;
  error: string;
  notice: string;
  setNotice: (v: string) => void;
  refresh: () => Promise<void>;
};
const Context = createContext<Inventory>({} as Inventory);
export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [summary, setSummary] = useState<Summary>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [b, s] = await Promise.all([
        api<Batch[]>("/batches"),
        api<Summary>("/dashboard"),
      ]);
      setBatches(b);
      setSummary(s);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <Context.Provider
      value={{ batches, summary, loading, error, notice, setNotice, refresh }}
    >
      {children}
    </Context.Provider>
  );
}
export const useInventory = () => useContext(Context);
