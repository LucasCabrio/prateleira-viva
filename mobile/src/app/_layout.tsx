import React from "react";
import { Slot } from "expo-router";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/AuthContext";
import { colors } from "../theme";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                maxWidth: 540,
                alignSelf: "center",
                backgroundColor: colors.bg,
              }}
            >
              <Slot />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
