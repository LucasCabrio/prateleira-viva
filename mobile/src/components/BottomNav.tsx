import { router, usePathname } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme";
const items = [
  { href: "/dashboard", title: "◉  Início" },
  { href: "/inventory", title: "▤  Prateleira" },
  { href: "/batch", title: "+  Novo lote" },
] as const;
export function BottomNav() {
  const path = usePathname();
  return (
    <View style={{ flexDirection: "row", borderTopWidth: 1, borderColor: colors.line,
      backgroundColor: "#fff", padding: 10, gap: 8 }}>
      {items.map(item => (
        <Pressable key={item.href} accessibilityRole="button" onPress={() => router.replace(item.href)}
          style={{ flex: 1, paddingVertical: 15, borderRadius: 14, alignItems: "center",
            backgroundColor: path === item.href ? colors.lime : "#fff" }}>
          <Text style={{ fontSize: 13, color: colors.ink, fontWeight: "700" }}>{item.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}
