import { useEffect } from "react";
import { Redirect, Slot } from "expo-router";
import { View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { InventoryProvider, useInventory } from "../../contexts/InventoryContext";
import { AppHeader } from "../../components/AppHeader";
import { BottomNav } from "../../components/BottomNav";
import { Loading } from "../../components/UI";
function Shell() {
  const { refresh } = useInventory();
  useEffect(() => { void refresh(); }, [refresh]);
  return (
    <>
      <AppHeader />
      <View style={{ flex: 1 }}><Slot /></View>
      <BottomNav />
    </>
  );
}
export default function Protected() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Redirect href="/login" />;
  return <InventoryProvider><Shell /></InventoryProvider>;
}
