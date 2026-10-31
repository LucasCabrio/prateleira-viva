import { Text, View } from "react-native";
import { Batch } from "../types";
import { colors, money } from "../theme";
import { s } from "./UI";
export function BatchAdvice({ batch }: { batch: Batch }) {
  let message = "Produto dentro do prazo. Mantenha o acompanhamento.";
  if (batch.days < 0) message = "Produto vencido: retire da venda.";
  else if (batch.discount) {
    message = "Sugestão: " + batch.discount + "% de desconto. Preço sugerido: " +
      money(batch.suggestedPrice) + " por unidade.";
  }
  return (
    <View style={[s.card, { backgroundColor: colors.lime, gap: 7 }]}>
      <Text style={s.section}>{batch.status}</Text>
      <Text style={{ color: colors.ink, lineHeight: 22 }}>{message}</Text>
    </View>
  );
}
