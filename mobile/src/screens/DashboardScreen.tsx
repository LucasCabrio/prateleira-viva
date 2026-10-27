import React from "react";
import { Text, View } from "react-native";
import { Batch, Summary } from "../types";
import { colors, money } from "../theme";
import { Button, s } from "../components/UI";
import { BatchCard } from "../components/BatchCard";
export function DashboardScreen({
  summary,
  batches,
  onEdit,
  onNew,
}: {
  summary: Summary;
  batches: Batch[];
  onEdit: (b: Batch) => void;
  onNew: () => void;
}) {
  return (
    <View style={{ gap: 22 }}>
      <View>
        <Text
          style={{
            fontSize: 12,
            letterSpacing: 2,
            color: colors.muted,
            fontWeight: "700",
          }}
        >
          VISÃO DO MERCADO
        </Text>
        <Text style={[s.title, { marginTop: 8 }]}>Cada produto conta.</Text>
        <Text style={s.subtitle}>Veja o que precisa da sua atenção hoje.</Text>
      </View>
      <View
        style={{
          backgroundColor: colors.green,
          borderRadius: 26,
          padding: 24,
          gap: 12,
        }}
      >
        <Text style={{ color: colors.lime, fontSize: 13, fontWeight: "600" }}>
          VALOR EM RISCO • PRÓXIMOS 7 DIAS
        </Text>
        <Text
          style={{
            fontSize: 42,
            fontWeight: "800",
            color: "#fff",
            letterSpacing: -1,
          }}
        >
          {money(summary.atRisk)}
        </Text>
        <Text style={{ color: "#D8E6DA", fontSize: 14, lineHeight: 21 }}>
          Valor de venda dos produtos que vencem em até 7 dias. Priorize sua
          saída.
        </Text>
        <View
          style={{ backgroundColor: "#3A7C60", padding: 12, borderRadius: 12 }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            {summary.urgent} lote(s) para agir hoje →
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        {[
          [summary.lots, "Lotes ativos"],
          [summary.units, "Unidades"],
          [summary.expired, "Vencidos"],
        ].map(([value, label]) => (
          <View key={label} style={[s.card, { flex: 1, padding: 14, gap: 6 }]}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color:
                  label === "Vencidos" && summary.expired
                    ? colors.red
                    : colors.ink,
              }}
            >
              {value}
            </Text>
            <Text style={{ fontSize: 11, color: colors.muted }}>{label}</Text>
          </View>
        ))}
      </View>
      <Button title="+ Cadastrar lote" onPress={onNew} />
      <View style={{ gap: 5 }}>
        <Text style={s.section}>Primeiro a vencer</Text>
        <Text style={s.subtitle}>
          Uma fila simples para evitar esquecimentos.
        </Text>
      </View>
      {batches.length === 0 ? (
        <Text style={s.subtitle}>
          Sua prateleira está vazia. Cadastre o primeiro lote.
        </Text>
      ) : (
        batches
          .slice(0, 3)
          .map((b) => (
            <BatchCard key={b.id} batch={b} onPress={() => onEdit(b)} />
          ))
      )}
      <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
        Descontos são sugestões. Produtos vencidos devem ser retirados da venda.
      </Text>
    </View>
  );
}
