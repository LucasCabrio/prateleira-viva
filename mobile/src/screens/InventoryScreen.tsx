import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Batch } from "../types";
import { colors } from "../theme";
import { Field, s } from "../components/UI";
import { BatchCard } from "../components/BatchCard";
export function InventoryScreen({
  batches,
  onEdit,
}: {
  batches: Batch[];
  onEdit: (b: Batch) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const visible = batches.filter(
    (b) =>
      b.name
        .toLocaleLowerCase("pt-BR")
        .includes(query.toLocaleLowerCase("pt-BR")) &&
      (filter === "Todos" ||
        (filter === "Até 7 dias" && b.days >= 0 && b.days <= 7) ||
        (filter === "Vencidos" && b.days < 0)),
  );
  return (
    <View style={{ gap: 20 }}>
      <Text style={s.title}>Sua prateleira</Text>
      <Text style={s.subtitle}>Consulte, organize e mantenha tudo em dia.</Text>
      <Field
        label="Buscar produto"
        placeholder="Ex.: iogurte"
        value={query}
        onChangeText={setQuery}
      />
      <View style={{ flexDirection: "row", gap: 8 }}>
        {["Todos", "Até 7 dias", "Vencidos"].map((f) => (
          <Pressable
            accessibilityRole="button"
            key={f}
            onPress={() => setFilter(f)}
            style={{
              padding: 12,
              borderRadius: 20,
              backgroundColor: f === filter ? colors.green : colors.line,
            }}
          >
            <Text
              style={{
                color: f === filter ? "#fff" : colors.ink,
                fontWeight: "600",
              }}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={{ color: colors.muted, fontSize: 12 }}>
        {visible.length} lote(s) • ordenados por validade
      </Text>
      {visible.map((b) => (
        <BatchCard key={b.id} batch={b} onPress={() => onEdit(b)} />
      ))}
      {!visible.length && (
        <View style={s.card}>
          <Text style={s.section}>Nenhum lote por aqui</Text>
          <Text style={s.subtitle}>Cadastre um lote ou altere a busca.</Text>
        </View>
      )}
    </View>
  );
}
