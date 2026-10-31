import { Pressable, Text } from "react-native";
import { colors } from "../theme";
import { s } from "../styles/common";
type Props = {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
};
export function Button({ title, onPress, secondary, danger, disabled }: Props) {
  const backgroundColor = danger ? colors.red : secondary ? colors.lime : colors.green;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}
      style={({ pressed }) => [s.button, { backgroundColor, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }]}>
      <Text style={{ color: secondary ? colors.ink : "#fff", fontWeight: "700", fontSize: 15 }}>
        {title}
      </Text>
    </Pressable>
  );
}
