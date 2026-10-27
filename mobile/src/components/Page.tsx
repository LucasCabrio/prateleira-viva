import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useInventory } from "../contexts/InventoryContext";
import { Button, Loading, Message } from "./UI";
export function Page({ children }: { children: React.ReactNode }) {
  const { refresh, loading, error, notice } = useInventory();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
      contentContainerStyle={{ padding: 22, paddingBottom: 40, gap: 16 }}
    >
      <Message text={notice} />
      {error ? (
        <View style={{ gap: 12 }}>
          <Message text={error} error />
          <Button title="Tentar novamente" onPress={refresh} />
        </View>
      ) : loading ? (
        <Loading />
      ) : (
        children
      )}
    </ScrollView>
  );
}
