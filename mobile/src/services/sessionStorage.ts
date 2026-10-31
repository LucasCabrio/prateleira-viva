import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
const key = "pv-token";
export const storage = {
  get: async () => Platform.OS === "web"
    ? sessionStorage.getItem(key) : SecureStore.getItemAsync(key),
  set: async (value: string) => Platform.OS === "web"
    ? sessionStorage.setItem(key, value) : SecureStore.setItemAsync(key, value),
  remove: async () => Platform.OS === "web"
    ? sessionStorage.removeItem(key) : SecureStore.deleteItemAsync(key),
};
