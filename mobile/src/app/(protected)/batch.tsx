import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { BatchFormScreen } from "../../screens/BatchFormScreen";
import { useInventory } from "../../contexts/InventoryContext";
import { Page } from "../../components/Page";
import { Message } from "../../components/UI";
export default function Batch() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { batches, refresh, setNotice } = useInventory();
  const batch = batches.find((b) => String(b.id) === id) || null;
  return (
    <Page>
      {id && !batch ? (
        <Message error text="Lote não encontrado." />
      ) : (
        <BatchFormScreen
          key={id || "new"}
          batch={batch}
          onCancel={() => router.replace("/inventory")}
          onSaved={(message) => {
            setNotice(message);
            void refresh();
            router.replace("/inventory");
          }}
        />
      )}
    </Page>
  );
}
