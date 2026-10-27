import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Batch } from "../types";
import { api } from "../services/api";
import { colors, dateLabel, money } from "../theme";
import { Button, Field, Message, s } from "../components/UI";
export function BatchFormScreen({
  batch,
  onSaved,
  onCancel,
}: {
  batch: Batch | null;
  onSaved: (message: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(batch?.name || "");
  const [barcode, setBarcode] = useState(batch?.barcode || "");
  const [quantity, setQuantity] = useState(batch ? String(batch.quantity) : "");
  const [price, setPrice] = useState(
    batch ? String(batch.price).replace(".", ",") : "",
  );
  const [expires, setExpires] = useState(batch ? dateLabel(batch.expires) : "");
  const [category, setCategory] = useState(batch?.category || "Mercearia");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const fail = (e: unknown) => {
    setMessage((e as Error).message);
    setIsError(true);
  };
  const lookup = async () => {
    setBusy(true);
    setMessage("");
    try {
      const p = await api<{ name: string; source: string }>(
        "/products/lookup?barcode=" + encodeURIComponent(barcode),
      );
      setName(p.name);
      setIsError(false);
      setMessage(
        "Nome preenchido via " + p.source + ". Confira os dados do lote.",
      );
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };
  const save = async () => {
    setMessage("");
    const date = expires.split("/").reverse().join("-");
    const numericPrice = Number(price.replace(",", "."));
    if (
      name.trim().length < 2 ||
      !/^\d+$/.test(quantity) ||
      Number(quantity) < 1 ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0 ||
      !/^\d{2}\/\d{2}\/\d{4}$/.test(expires)
    ) {
      fail(
        new Error("Confira nome, quantidade, preço e validade (DD/MM/AAAA)."),
      );
      return;
    }
    setBusy(true);
    try {
      await api(
        batch ? "/batches/" + batch.id : "/batches",
        batch ? "PUT" : "POST",
        {
          name,
          barcode,
          quantity: Number(quantity),
          price: numericPrice,
          expires: date,
          category,
        },
      );
      onSaved(
        batch ? "Lote atualizado com sucesso." : "Lote cadastrado com sucesso.",
      );
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    setBusy(true);
    try {
      await api("/batches/" + batch!.id, "DELETE");
      onSaved("Lote excluído com sucesso.");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };
  return (
    <View style={{ gap: 19 }}>
      <Text style={s.title}>{batch ? "Detalhes do lote" : "Novo lote"}</Text>
      <Text style={s.subtitle}>
        Cada lote tem sua própria validade. Cadastre separadamente produtos com
        datas diferentes.
      </Text>
      {batch && (
        <View style={[s.card, { backgroundColor: colors.lime, gap: 7 }]}>
          <Text style={s.section}>{batch.status}</Text>
          <Text style={{ color: colors.ink, lineHeight: 22 }}>
            {batch.days < 0
              ? "Produto vencido: retire da venda."
              : batch.discount
                ? "Sugestão: " +
                  batch.discount +
                  "% de desconto. Preço sugerido: " +
                  money(batch.suggestedPrice) +
                  " por unidade."
                : "Produto dentro do prazo. Mantenha o acompanhamento."}
          </Text>
        </View>
      )}
      <Field
        label="Código de barras (opcional)"
        value={barcode}
        onChangeText={setBarcode}
        keyboardType="number-pad"
        placeholder="Ex.: 3017620422003"
      />
      <Button
        secondary
        title="Buscar no Open Food Facts"
        onPress={lookup}
        disabled={busy || !barcode}
      />
      <Field
        label="Nome do produto"
        value={name}
        onChangeText={setName}
        maxLength={100}
      />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Field
            label="Quantidade"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Field
            label="Preço unitário (R$)"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>
      </View>
      <Field
        label="Validade (DD/MM/AAAA)"
        placeholder="30/12/2026"
        value={expires}
        onChangeText={setExpires}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />
      <Text style={s.label}>Categoria</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {["Laticínios", "Mercearia", "Bebidas", "Hortifruti", "Outros"].map(
          (c) => (
            <Pressable
              accessibilityRole="button"
              key={c}
              onPress={() => setCategory(c)}
              style={{
                padding: 11,
                borderRadius: 20,
                backgroundColor: category === c ? colors.green : colors.line,
              }}
            >
              <Text style={{ color: category === c ? "#fff" : colors.ink }}>
                {c}
              </Text>
            </Pressable>
          ),
        )}
      </View>
      <Message text={message} error={isError} />
      <Button
        title={busy ? "Aguarde..." : "Salvar lote"}
        onPress={save}
        disabled={busy}
      />
      <Button
        secondary
        title="Cancelar e voltar"
        onPress={onCancel}
        disabled={busy}
      />
      {batch && !confirm && (
        <Button
          danger
          title="Excluir lote"
          onPress={() => setConfirm(true)}
          disabled={busy}
        />
      )}
      {confirm && (
        <View style={[s.card, { gap: 12 }]}>
          <Text style={s.section}>Excluir este lote?</Text>
          <Text style={s.subtitle}>
            Esta ação remove o registro permanentemente.
          </Text>
          <Button
            danger
            title="Sim, excluir definitivamente"
            onPress={remove}
            disabled={busy}
          />
          <Button
            secondary
            title="Manter lote"
            onPress={() => setConfirm(false)}
            disabled={busy}
          />
        </View>
      )}
    </View>
  );
}
