import React from "react";
import { router } from "expo-router";
import { InventoryScreen } from "../../screens/InventoryScreen";
import { useInventory } from "../../contexts/InventoryContext";
import { Page } from "../../components/Page";
export default function Inventory() {
  const { batches } = useInventory();
  return (
    <Page>
      <InventoryScreen
        batches={batches}
        onEdit={(b) =>
          router.push({ pathname: "/batch", params: { id: String(b.id) } })
        }
      />
    </Page>
  );
}
