import { ScrollView, Text, View, Pressable } from "react-native";
import { useLogin } from "../hooks/useLogin";
import { LoginIntro } from "../components/LoginIntro";
import { Button, Field, Message, s } from "../components/UI";
import { colors } from "../theme";
export function LoginScreen() {
  const form = useLogin();
  return (
    <ScrollView keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 24, gap: 24, flexGrow: 1, justifyContent: "center" }}>
      <LoginIntro />
      <View style={[s.card, { gap: 17 }]}>
        <Text style={s.section}>{form.register ? "Crie sua conta" : "Bem-vindo de volta"}</Text>
        {form.register && <Field label="Seu nome" value={form.name} onChangeText={form.setName} />}
        <Field label="E-mail" value={form.email} onChangeText={form.setEmail}
          autoCapitalize="none" keyboardType="email-address" />
        <Field label="Senha" value={form.password} onChangeText={form.setPassword}
          secureTextEntry autoCapitalize="none" />
        <Message text={form.error} error />
        <Button title={form.busy ? "Entrando..." : form.register ? "Criar conta" : "Entrar no mercado"}
          onPress={form.submit} disabled={form.busy} />
        <Pressable accessibilityRole="button" onPress={form.toggle}>
          <Text style={[s.greenText, { textAlign: "center", padding: 8 }]}>
            {form.register ? "Já tenho uma conta" : "Primeiro acesso? Criar conta"}
          </Text>
        </Pressable>
      </View>
      <Text style={{ textAlign: "center", fontSize: 12, color: colors.muted }}>
        Prateleira Viva · Controle de lotes
      </Text>
    </ScrollView>
  );
}
