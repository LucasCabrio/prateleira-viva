import { Platform } from "react-native";
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "android"
    ? "http://10.0.2.2:3001"
    : "http://localhost:3001");
let token: string | null = null;
let expired: () => void = () => {};
export function setSession(value: string | null, onExpired?: () => void) {
  token = value;
  if (onExpired) expired = onExpired;
}
export async function api<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(API_URL + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 && !path.startsWith("/auth/login")) expired();
      throw new Error(data.message || "Não foi possível concluir.");
    }
    return data;
  } catch (error) {
    if (error instanceof Error && error.message === "Failed to fetch")
      throw new Error(
        "Sem conexão com o servidor. Confira a rede e o endereço da API.",
      );
    if (error instanceof Error && error.name === "AbortError")
      throw new Error("O servidor demorou a responder. Tente novamente.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
