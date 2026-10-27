import React, { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Button, Field, Message, s } from "../components/UI";
import { colors } from "../theme";
export function LoginScreen() {
  const { signIn } = useAuth();
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setError("");
    if (
      !email.includes("@") ||
      password.length < 8 ||
      (register && name.trim().length < 2)
    ) {
      setError(
        "Preencha os campos. A senha precisa de pelo menos 8 caracteres.",
      );
      return;
    }
    setBusy(true);
    try {
      await signIn(email, password, register ? name : undefined);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 24,
        gap: 24,
        flexGrow: 1,
        justifyContent: "center",
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ gap: 14 }}>
        <View
          style={{
            backgroundColor: colors.green,
            borderRadius: 22,
            width: 64,
            height: 64,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.lime, fontSize: 32, fontWeight: "900" }}>
            pv
          </Text>
        </View>
        <Text
          style={{
            color: colors.green,
            fontSize: 12,
            fontWeight: "800",
            letterSpacing: 3,
          }}
        >
          PRATELEIRA VIVA
        </Text>
        <Text style={[s.title, { fontSize: 32, lineHeight: 38 }]}>
          Controle de validade
        </Text>
        <Text style={s.subtitle}>
          Consulte os lotes do mercado e acompanhe os próximos vencimentos.
        </Text>
      </View>
      <View style={[s.card, { gap: 17 }]}>
        <Text style={s.section}>
          {register ? "Crie sua conta" : "Bem-vindo de volta"}
        </Text>
        {register && (
          <Field label="Seu nome" value={name} onChangeText={setName} />
        )}
        <Field
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Field
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <Message text={error} error />
        <Button
          title={
            busy
              ? "Entrando..."
              : register
                ? "Criar conta"
                : "Entrar no mercado"
          }
          onPress={submit}
          disabled={busy}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setRegister(!register);
            setError("");
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: colors.green,
              fontWeight: "600",
              padding: 8,
            }}
          >
            {register ? "Já tenho uma conta" : "Primeiro acesso? Criar conta"}
          </Text>
        </Pressable>
      </View>
      <Text style={{ textAlign: "center", fontSize: 12, color: colors.muted }}>
        Prateleira Viva · Controle de lotes
      </Text>
    </ScrollView>
  );
}
