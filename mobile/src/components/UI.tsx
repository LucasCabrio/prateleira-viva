import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { colors } from "../theme";
export function Button({
  title,
  onPress,
  secondary = false,
  danger = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.button,
        {
          backgroundColor: danger
            ? colors.red
            : secondary
              ? colors.lime
              : colors.green,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: secondary ? colors.ink : "#fff",
          fontWeight: "700",
          fontSize: 15,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 7 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#9B9F98"
        {...props}
        style={[s.input, props.style]}
      />
    </View>
  );
}
export function Message({
  text,
  error = false,
}: {
  text: string;
  error?: boolean;
}) {
  if (!text) return null;
  return (
    <View
      accessibilityRole="alert"
      style={[s.message, { backgroundColor: error ? "#FBEAE5" : colors.lime }]}
    >
      <Text style={{ color: error ? colors.red : colors.ink, lineHeight: 21 }}>
        {text}
      </Text>
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
export const s = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  label: { fontSize: 13, fontWeight: "600", color: colors.ink },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 13,
    fontSize: 16,
    color: colors.ink,
    minHeight: 50,
  },
  message: { padding: 14, borderRadius: 12 },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -1,
  },
  subtitle: { fontSize: 15, lineHeight: 23, color: colors.muted },
  section: { fontSize: 20, fontWeight: "700", color: colors.ink },
  card: {
    backgroundColor: colors.paper,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
