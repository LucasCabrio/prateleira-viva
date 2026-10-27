import React, { useEffect } from "react";
import { Redirect, Slot, router, usePathname } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {
  InventoryProvider,
  useInventory,
} from "../../contexts/InventoryContext";
import { Loading } from "../../components/UI";
import { colors } from "../../theme";
function Shell() {
  const { user, signOut } = useAuth();
  const { refresh } = useInventory();
  const path = usePathname();
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return (
    <>
      <View
        style={{
          paddingHorizontal: 22,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderColor: colors.line,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{ fontSize: 18, fontWeight: "800", color: colors.green }}
          >
            prateleira viva<Text style={{ color: colors.orange }}> •</Text>
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 11,
              color: colors.muted,
              marginTop: 4,
              maxWidth: 250,
            }}
          >
            {user?.name}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void signOut().catch(() => {});
          }}
        >
          <Text style={{ color: colors.green, padding: 10, fontWeight: "600" }}>
            Sair
          </Text>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <View
        style={{
          flexDirection: "row",
          borderTopWidth: 1,
          borderColor: colors.line,
          backgroundColor: "#fff",
          padding: 10,
          gap: 8,
        }}
      >
        {[
          { href: "/dashboard", title: "◉  Início" },
          { href: "/inventory", title: "▤  Prateleira" },
          { href: "/batch", title: "+  Novo lote" },
        ].map((item) => (
          <Pressable
            key={item.href}
            accessibilityRole="button"
            onPress={() => router.replace(item.href as "/dashboard")}
            style={{
              flex: 1,
              paddingVertical: 15,
              borderRadius: 14,
              alignItems: "center",
              backgroundColor: path === item.href ? colors.lime : "#fff",
            }}
          >
            <Text
              style={{ fontSize: 13, color: colors.ink, fontWeight: "700" }}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
export default function Protected() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Redirect href="/login" />;
  return (
    <InventoryProvider>
      <Shell />
    </InventoryProvider>
  );
}
