import { Pressable, Text, View } from "react-native";
import { Batch } from "../types";
import { colors, dateLabel, money } from "../theme";
import { s } from "./UI";
export function BatchCard({ batch, onPress }: { batch: Batch; onPress: () => void }) {
  const expired = batch.days < 0;
  const statusColor = expired ? colors.red : batch.days <= 2 ? colors.orange : colors.green;
  const deadline = expired ? "retirar" : batch.days === 0 ? "hoje" : batch.days + "d";
  const action = expired ? "Retirar da venda" : batch.discount ? "Sugerido: -" + batch.discount + "%" : "Ver lote";
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={"Editar " + batch.name}
      onPress={onPress} style={[s.card, { gap: 12 }]}>
      <View style={s.spacedRow}>
        <Text style={{ fontSize: 11, letterSpacing: 1.4, color: colors.muted, fontWeight: "700" }}>
          {batch.category.toUpperCase()}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: "700", color: statusColor }}>
          {batch.status} • {deadline}
        </Text>
      </View>
      <Text style={s.section}>{batch.name}</Text>
      <Text style={s.subtitle}>{batch.quantity} unidades · Validade {dateLabel(batch.expires)}</Text>
      <View style={[s.spacedRow, { borderTopWidth: 1, borderColor: colors.line, paddingTop: 12 }]}>
        <Text style={{ fontWeight: "700", color: colors.ink }}>{money(batch.price)} / un.</Text>
        <Text style={{ fontWeight: "600", color: expired ? colors.red : colors.green }}>{action} →</Text>
      </View>
    </Pressable>
  );
}
