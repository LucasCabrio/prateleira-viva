import { useState } from "react";
import { Batch } from "../types";
import { api } from "../services/api";
import { BatchValues, initialValues, parseValues } from "../services/batchForm";
export function useBatchForm(batch: Batch | null, onSaved: (message: string) => void) {
  const [values, setValues] = useState(() => initialValues(batch));
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);
  const change = (key: keyof BatchValues, value: string) => {
    setValues(current => ({ ...current, [key]: value }));
  };
  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setMessage("");
    setIsError(false);
    try { await action(); }
    catch (error) { setMessage((error as Error).message); setIsError(true); }
    finally { setBusy(false); }
  };
  const lookup = () => run(async () => {
    const product = await api<{ name: string; source: string }>(
      "/products/lookup?barcode=" + encodeURIComponent(values.barcode));
    change("name", product.name);
    setMessage("Nome preenchido via " + product.source + ". Confira os dados do lote.");
  });
  const save = () => run(async () => {
    await api(batch ? "/batches/" + batch.id : "/batches", batch ? "PUT" : "POST", parseValues(values));
    onSaved(batch ? "Lote atualizado com sucesso." : "Lote cadastrado com sucesso.");
  });
  const remove = () => run(async () => {
    if (!batch) return;
    await api("/batches/" + batch.id, "DELETE");
    onSaved("Lote excluído com sucesso.");
  });
  return { values, change, message, isError, busy, lookup, save, remove };
}
