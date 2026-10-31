import { Text, View } from "react-native";
import { Batch, Summary } from "../types";
import { colors } from "../theme";
import { Button, s } from "../components/UI";
import { BatchCard } from "../components/BatchCard";
import { StockSummary } from "../components/StockSummary";
type Props = {
  summary: Summary;
  batches: Batch[];
  onEdit: (batch: Batch) => void;
  onNew: () => void;
};
export function DashboardScreen({ summary, batches, onEdit, onNew }: Props) {
  return (
    <View style={{ gap: 22 }}>
      <View>
        <Text style={{ fontSize: 12, letterSpacing: 2, color: colors.muted, fontWeight: "700" }}>
          VISÃO DO MERCADO
        </Text>
        <Text style={[s.title, { marginTop: 8 }]}>Resumo dos lotes</Text>
        <Text style={s.subtitle}>Estoque cadastrado e prazos de validade.</Text>
      </View>
      <StockSummary summary={summary} />
      <Button title="+ Cadastrar lote" onPress={onNew} />
      <View style={{ gap: 5 }}>
        <Text style={s.section}>Primeiro a vencer</Text>
        <Text style={s.subtitle}>Lotes ordenados pela data de validade.</Text>
      </View>
      {batches.length === 0 && <Text style={s.subtitle}>Sua prateleira está vazia. Cadastre o primeiro lote.</Text>}
      {batches.slice(0, 3).map(batch => (
        <BatchCard key={batch.id} batch={batch} onPress={() => onEdit(batch)} />
      ))}
      <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
        Descontos são sugestões. Produtos vencidos devem ser retirados da venda.
      </Text>
    </View>
  );
}
