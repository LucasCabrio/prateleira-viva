import { Text, View } from "react-native";
import { BatchValues } from "../services/batchForm";
import { Button, Field, s } from "./UI";
import { Options } from "./Options";
type Props = {
  values: BatchValues;
  change: (key: keyof BatchValues, value: string) => void;
  lookup: () => void;
  busy: boolean;
};
export function BatchFields({ values, change, lookup, busy }: Props) {
  const field = (key: keyof BatchValues) => ({
    value: values[key], onChangeText: (value: string) => change(key, value),
  });
  return (
    <>
      <Field label="Código de barras (opcional)" {...field("barcode")}
        keyboardType="number-pad" placeholder="Ex.: 3017620422003" />
      <Button secondary title="Buscar no Open Food Facts" onPress={lookup} disabled={busy || !values.barcode} />
      <Field label="Nome do produto" {...field("name")} maxLength={100} />
      <View style={s.row}>
        <View style={{ flex: 1 }}><Field label="Quantidade" {...field("quantity")} keyboardType="number-pad" /></View>
        <View style={{ flex: 1 }}><Field label="Preço unitário (R$)" {...field("price")} keyboardType="decimal-pad" /></View>
      </View>
      <Field label="Validade (DD/MM/AAAA)" {...field("expires")}
        placeholder="30/12/2026" keyboardType="numbers-and-punctuation" maxLength={10} />
      <Text style={s.label}>Categoria</Text>
      <Options values={["Laticínios", "Mercearia", "Bebidas", "Hortifruti", "Outros"]}
        selected={values.category} onSelect={value => change("category", value)} />
    </>
  );
}
