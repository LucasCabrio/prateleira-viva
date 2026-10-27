import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { Loading } from "../components/UI";
export default function Index() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return <Redirect href={user ? "/dashboard" : "/login"} />;
}
