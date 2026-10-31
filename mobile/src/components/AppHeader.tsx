import { Pressable, Text, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "../theme";
import { s } from "./UI";
export function AppHeader() {
  const { user, signOut } = useAuth();
  return (
    <View style={[s.spacedRow, {
      paddingHorizontal: 22, paddingVertical: 16, alignItems: "center",
      borderBottomWidth: 1, borderColor: colors.line,
    }]}>
      <View>
        <Text style={{ fontSize: 18, fontWeight: "800", color: colors.green }}>prateleira viva •</Text>
        <Text numberOfLines={1} style={{ fontSize: 11, color: colors.muted, marginTop: 4, maxWidth: 250 }}>
          {user?.name}
        </Text>
      </View>
      <Pressable accessibilityRole="button" onPress={() => { void signOut().catch(() => {}); }}>
        <Text style={[s.greenText, { padding: 10 }]}>Sair</Text>
      </Pressable>
    </View>
  );
}
