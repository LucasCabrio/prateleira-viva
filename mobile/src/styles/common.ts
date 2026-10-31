import { StyleSheet } from "react-native";
import { colors } from "../theme";
export const s = StyleSheet.create({
  button: { padding: 15, borderRadius: 15, alignItems: "center", justifyContent: "center", minHeight: 50 },
  label: { fontSize: 13, fontWeight: "600", color: colors.ink },
  input: {
    borderWidth: 1, borderColor: colors.line, backgroundColor: "#fff",
    padding: 15, borderRadius: 13, fontSize: 16, color: colors.ink, minHeight: 50,
  },
  message: { padding: 14, borderRadius: 12 },
  title: { fontSize: 30, fontWeight: "800", color: colors.ink, letterSpacing: -1 },
  subtitle: { fontSize: 15, lineHeight: 23, color: colors.muted },
  section: { fontSize: 20, fontWeight: "700", color: colors.ink },
  card: { backgroundColor: colors.paper, padding: 20, borderRadius: 22, borderWidth: 1, borderColor: colors.line },
  row: { flexDirection: "row", gap: 12 },
  spacedRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  greenText: { color: colors.green, fontWeight: "600" },
});
