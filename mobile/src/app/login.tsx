import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { LoginScreen } from "../screens/LoginScreen";
import { Loading } from "../components/UI";
export default function Login() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (user) return <Redirect href="/dashboard" />;
  return <LoginScreen />;
}
