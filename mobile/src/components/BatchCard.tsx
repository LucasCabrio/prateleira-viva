import React from "react";
import { Pressable, Text, View } from "react-native";
import { Batch } from "../types";
import { colors, dateLabel, money } from "../theme";
import { s } from "./UI";
export function BatchCard({
  batch,
  onPress,
}: {
  batch: Batch;
  onPress: () => void;
}) {
  const danger = batch.days < 0;
  const urgent = batch.days <= 2;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Editar ${batch.name}`}
      onPress={onPress}
      style={[s.card, { gap: 12 }]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            letterSpacing: 1.4,
            color: colors.muted,
            fontWeight: "700",
          }}
        >
          {batch.category.toUpperCase()}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: danger ? colors.red : urgent ? colors.orange : colors.green,
          }}
        >
          {batch.status} •{" "}
          {batch.days < 0
            ? "retirar"
            : batch.days === 0
              ? "hoje"
              : `${batch.days}d`}
        </Text>
      </View>
      <Text style={{ fontSize: 20, fontWeight: "700", color: colors.ink }}>
        {batch.name}
      </Text>
      <Text style={s.subtitle}>
        {batch.quantity} unidades · Validade {dateLabel(batch.expires)}
      </Text>
      <View
        style={{
          borderTopWidth: 1,
          borderColor: colors.line,
          paddingTop: 12,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "700", color: colors.ink }}>
          {money(batch.price)} / un.
        </Text>
        <Text
          style={{
            fontWeight: "600",
            color: danger ? colors.red : colors.green,
          }}
        >
          {danger
            ? "Retirar da venda"
            : batch.discount
              ? `Sugerido: -${batch.discount}%`
              : "Ver lote"}{" "}
          →
        </Text>
      </View>
    </Pressable>
  );
}
