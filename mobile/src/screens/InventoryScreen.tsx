import { useState } from "react";
import { Text, View } from "react-native";
import { Batch } from "../types";
import { colors } from "../theme";
import { Field, s } from "../components/UI";
import { BatchCard } from "../components/BatchCard";
import { Options } from "../components/Options";
export function InventoryScreen({ batches, onEdit }: { batches: Batch[]; onEdit: (batch: Batch) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const visible = batches.filter(batch => {
    const matchesName = batch.name.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"));
    const matchesDate = filter === "Todos" || (filter === "Vencidos"
      ? batch.days < 0 : batch.days >= 0 && batch.days <= 7);
    return matchesName && matchesDate;
  });
  return (
    <View style={{ gap: 20 }}>
      <Text style={s.title}>Sua prateleira</Text>
      <Text style={s.subtitle}>Consulte, organize e mantenha tudo em dia.</Text>
      <Field label="Buscar produto" placeholder="Ex.: iogurte" value={query} onChangeText={setQuery} />
      <Options values={["Todos", "Até 7 dias", "Vencidos"]} selected={filter} onSelect={setFilter} />
      <Text style={{ color: colors.muted, fontSize: 12 }}>{visible.length} lote(s) • ordenados por validade</Text>
      {visible.map(batch => <BatchCard key={batch.id} batch={batch} onPress={() => onEdit(batch)} />)}
      {!visible.length && (
        <View style={s.card}>
          <Text style={s.section}>Nenhum lote por aqui</Text>
          <Text style={s.subtitle}>Cadastre um lote ou altere a busca.</Text>
        </View>
      )}
    </View>
  );
}
