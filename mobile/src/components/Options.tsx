import { Pressable, Text, View } from "react-native";
import { colors } from "../theme";
type Props = { values: string[]; selected: string; onSelect: (value: string) => void };
export function Options({ values, selected, onSelect }: Props) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {values.map(value => (
        <Pressable key={value} accessibilityRole="button" onPress={() => onSelect(value)}
          style={{ padding: 11, borderRadius: 20,
            backgroundColor: value === selected ? colors.green : colors.line }}>
          <Text style={{ color: value === selected ? "#fff" : colors.ink }}>{value}</Text>
        </Pressable>
      ))}
    </View>
  );
}
