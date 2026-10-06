import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IconLock, IconMail, IconUser } from "@tabler/icons-react";
import useInput from "../../../hooks/useInput";
import { asyncRegister } from "../states/action";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { btnPrimary, inputCls } from "../../../helpers/uiClasses";

const iconCls = "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400";

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
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Daftar akun</h1>
        <p className="mt-1 text-sm text-slate-500">Buat akun gratis dan mulai catat laporanmu.</p>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Nama
        <div className="relative">
          <IconUser size={18} aria-hidden="true" className={iconCls} />
          <input
            id="register-name-input"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Nama lengkap"
            className={`${inputCls} pl-10`}
            value={name}
            onChange={setName}
          />
        </div>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Email
        <div className="relative">
          <IconMail size={18} aria-hidden="true" className={iconCls} />
          <input
            id="register-email-input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="nama@email.com"
            className={`${inputCls} pl-10`}
            value={email}
            onChange={setEmail}
          />
        </div>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Kata sandi
        <div className="relative">
          <IconLock size={18} aria-hidden="true" className={iconCls} />
          <input
            id="register-password-input"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Minimal 6 karakter"
            className={`${inputCls} pl-10`}
            value={password}
            onChange={setPassword}
          />
        </div>
      </label>

      <button id="register-submit-button" type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
        {busy ? "Memproses..." : "Daftar"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Sudah punya akun? <Link className="font-semibold text-teal-700 hover:text-teal-800 hover:underline" to="/auth/login">Masuk</Link>
      </p>
    </form>
  );
}
