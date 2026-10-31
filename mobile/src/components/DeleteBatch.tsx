import { useState } from "react";
import { Text, View } from "react-native";
import { Button, s } from "./UI";
export function DeleteBatch({ remove, busy }: { remove: () => void; busy: boolean }) {
  const [confirm, setConfirm] = useState(false);
  if (!confirm) {
    return <Button danger title="Excluir lote" onPress={() => setConfirm(true)} disabled={busy} />;
  }
  return (
    <View style={[s.card, { gap: 12 }]}>
      <Text style={s.section}>Excluir este lote?</Text>
      <Text style={s.subtitle}>Esta ação remove o registro permanentemente.</Text>
      <Button danger title="Sim, excluir definitivamente" onPress={remove} disabled={busy} />
      <Button secondary title="Manter lote" onPress={() => setConfirm(false)} disabled={busy} />
    </View>
  );
}
