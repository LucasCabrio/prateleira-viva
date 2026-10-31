import { Text, View } from "react-native";
import { colors } from "../theme";
import { s } from "./UI";
export function LoginIntro() {
  return (
    <View style={{ gap: 14 }}>
      <View style={{ backgroundColor: colors.green, borderRadius: 22, width: 64,
        height: 64, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.lime, fontSize: 32, fontWeight: "900" }}>pv</Text>
      </View>
      <Text style={{ color: colors.green, fontSize: 12, fontWeight: "800", letterSpacing: 3 }}>
        PRATELEIRA VIVA
      </Text>
      <Text style={[s.title, { fontSize: 32, lineHeight: 38 }]}>Controle de validade</Text>
      <Text style={s.subtitle}>Consulte os lotes do mercado e acompanhe os próximos vencimentos.</Text>
    </View>
  );
}
