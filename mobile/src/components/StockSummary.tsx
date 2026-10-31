import { Text, View } from "react-native";
import { Summary } from "../types";
import { colors, money } from "../theme";
import { s } from "./UI";
export function StockSummary({ summary }: { summary: Summary }) {
  const counts = [[summary.lots, "Lotes"], [summary.units, "Unidades"], [summary.expired, "Vencidos"]];
  return (
    <View style={{ gap: 22 }}>
      <View style={{ backgroundColor: colors.green, borderRadius: 26, padding: 24, gap: 12 }}>
        <Text style={{ color: colors.lime, fontSize: 13, fontWeight: "600" }}>
          VALOR EM RISCO • PRÓXIMOS 7 DIAS
        </Text>
        <Text style={{ fontSize: 42, fontWeight: "800", color: "#fff", letterSpacing: -1 }}>
          {money(summary.atRisk)}
        </Text>
        <Text style={{ color: "#D8E6DA", fontSize: 14, lineHeight: 21 }}>
          Soma do preço dos produtos que vencem em até 7 dias.
        </Text>
        <View style={{ backgroundColor: "#3A7C60", padding: 12, borderRadius: 12 }}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>{summary.urgent} lote(s) vencem em até 2 dias</Text>
        </View>
      </View>
      <View style={s.row}>
        {counts.map(([value, label]) => (
          <View key={label} style={[s.card, { flex: 1, padding: 14, gap: 6 }]}>
            <Text style={{ fontSize: 26, fontWeight: "800",
              color: label === "Vencidos" && summary.expired ? colors.red : colors.ink }}>{value}</Text>
            <Text style={{ fontSize: 11, color: colors.muted }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
