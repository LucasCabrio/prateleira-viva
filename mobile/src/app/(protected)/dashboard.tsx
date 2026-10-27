import React from "react";
import { router } from "expo-router";
import { DashboardScreen } from "../../screens/DashboardScreen";
import { useInventory } from "../../contexts/InventoryContext";
import { Page } from "../../components/Page";
export default function Dashboard() {
  const { summary, batches } = useInventory();
  return (
    <Page>
      <DashboardScreen
        summary={summary}
        batches={batches}
        onEdit={(b) =>
          router.push({ pathname: "/batch", params: { id: String(b.id) } })
        }
        onNew={() => router.push("/batch")}
      />
    </Page>
  );
}
