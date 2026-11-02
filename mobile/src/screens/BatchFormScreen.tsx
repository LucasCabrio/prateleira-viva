// Monta a tela de cadastro e edição de lotes e conecta os campos e botões às ações do formulário.
import { Text, View } from "react-native";
import { Batch } from "../types";
import { useBatchForm } from "../hooks/useBatchForm";
import { BatchFields } from "../components/BatchFields";
import { BatchAdvice } from "../components/BatchAdvice";
import { DeleteBatch } from "../components/DeleteBatch";
import { Button, Message, s } from "../components/UI";
type Props = {
  batch: Batch | null;
  onSaved: (message: string) => void;
  onCancel: () => void;
};
export function BatchFormScreen({ batch, onSaved, onCancel }: Props) {
  const form = useBatchForm(batch, onSaved);
  return (
    <View style={{ gap: 19 }}>
      <Text style={s.title}>{batch ? "Detalhes do lote" : "Novo lote"}</Text>
      <Text style={s.subtitle}>
        Cada lote tem sua própria validade. Cadastre separadamente produtos com datas diferentes.
      </Text>
      {batch && <BatchAdvice batch={batch} />}
      <BatchFields values={form.values} change={form.change} lookup={form.lookup} busy={form.busy} />
      <Message text={form.message} error={form.isError} />
      <Button title={form.busy ? "Aguarde..." : "Salvar lote"} onPress={form.save} disabled={form.busy} />
      <Button secondary title="Cancelar e voltar" onPress={onCancel} disabled={form.busy} />
      {batch && <DeleteBatch remove={form.remove} busy={form.busy} />}
    </View>
  );
}
