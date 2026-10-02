import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useInput from "../../../hooks/useInput";
import { asyncRegister } from "../states/action";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { inputCls } from "./LoginPage";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useInput();
  const [email, setEmail] = useInput();
  const [password, setPassword] = useInput();
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || password.length < 6) return showErrorDialog("Lengkapi data; kata sandi minimal 6 karakter.");
    setBusy(true);
    const ok = await dispatch(asyncRegister({ name, email, password }));
    setBusy(false);
    if (ok) navigate("/auth/login");
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-2xl font-bold">Daftar akun</h1>
      
      {/* 1. Tambah id="register-name-input" */}
      <label className="block text-sm font-medium">
        Nama
        <input
          id="register-name-input"
          type="text"
          name="name"
          autoComplete="name"
          className={inputCls}
          value={name}
          onChange={setName}
        />
      </label>

      {/* 2. Tambah id="register-email-input" */}
      <label className="block text-sm font-medium">
        Email
        <input
          id="register-email-input"
          type="email"
          name="email"
          autoComplete="email"
          className={inputCls}
          value={email}
          onChange={setEmail}
        />
      </label>

      {/* 3. Tambah id="register-password-input" */}
      <label className="block text-sm font-medium">
        Kata sandi
        <input
          id="register-password-input"
          type="password"
          name="password"
          autoComplete="new-password"
          className={inputCls}
          value={password}
          onChange={setPassword}
        />
      </label>

      {/* 4. Tambah id="register-submit-button" */}
      <button
        id="register-submit-button"
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-teal-700 py-2 font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {busy ? "Memproses..." : "Daftar"}
      </button>

      <p className="text-sm text-slate-600">
        Sudah punya akun? <Link className="font-semibold text-teal-700" to="/auth/login">Masuk</Link>
      </p>
    </form>
  );
}