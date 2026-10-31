import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "../theme";
import { s } from "../styles/common";
export function Message({ text, error = false }: { text: string; error?: boolean }) {
  if (!text) return null;
  return (
    <View accessibilityRole="alert"
      style={[s.message, { backgroundColor: error ? "#FBEAE5" : colors.lime }]}>
      <Text style={{ color: error ? colors.red : colors.ink, lineHeight: 21 }}>{text}</Text>
    </View>
  );
}
export function Loading() {
  return (
    <View style={{ padding: 40 }}>
      <ActivityIndicator color={colors.green} />
      <Text style={{ textAlign: "center", marginTop: 12, color: colors.muted }}>
        Carregando sua prateleira...
      </Text>
    </View>
  );
}
