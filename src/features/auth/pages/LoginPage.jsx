import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IconLock, IconMail } from "@tabler/icons-react";
import useInput from "../../../hooks/useInput";
import { asyncLogin } from "../states/action";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { btnPrimary, inputCls } from "../../../helpers/uiClasses";

const iconCls = "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useInput();
  const [password, setPassword] = useInput();
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) return showErrorDialog("Email dan kata sandi wajib diisi.");
    setBusy(true);
    const ok = await dispatch(asyncLogin({ email, password }));
    setBusy(false);
    if (ok) navigate("/");
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Masuk</h1>
        <p className="mt-1 text-sm text-slate-500">Selamat datang kembali! Lanjutkan ke akunmu.</p>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Email
        <div className="relative">
          <IconMail size={18} aria-hidden="true" className={iconCls} />
          <input
            id="login-email-input"
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
            id="login-password-input"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={`${inputCls} pl-10`}
            value={password}
            onChange={setPassword}
          />
        </div>
      </label>

      <button id="login-submit-button" type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
        {busy ? "Memproses..." : "Masuk"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Belum punya akun? <Link className="font-semibold text-teal-700 hover:text-teal-800 hover:underline" to="/auth/register">Daftar</Link>
      </p>
    </form>
  );
}
