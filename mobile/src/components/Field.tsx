import { Text, TextInput, TextInputProps, View } from "react-native";
import { s } from "../styles/common";
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 7 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput accessibilityLabel={label} placeholderTextColor="#9B9F98"
        {...props} style={[s.input, props.style]} />
    </View>
  );
}
