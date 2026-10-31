import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
export function useLogin() {
  const { signIn } = useAuth();
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setError("");
    if (!email.includes("@") || password.length < 8 || (register && name.trim().length < 2)) {
      setError("Preencha os campos. A senha precisa de pelo menos 8 caracteres.");
      return;
    }
    setBusy(true);
    try { await signIn(email, password, register ? name : undefined); }
    catch (error) { setError((error as Error).message); }
    finally { setBusy(false); }
  };
  const toggle = () => {
    setRegister(!register);
    setError("");
  };
  return { register, email, setEmail, password, setPassword, name, setName, error, busy, submit, toggle };
}
