import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useInput from "../../../hooks/useInput";
import { asyncLogin } from "../states/action";
import { showErrorDialog } from "../../../helpers/toolsHelper";

export const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-2 focus:outline-teal-600";

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
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-2xl font-bold">Masuk</h2>
      <label className="block text-sm font-medium">Email<input type="email" className={inputCls} value={email} onChange={setEmail} /></label>
      <label className="block text-sm font-medium">Kata sandi<input type="password" className={inputCls} value={password} onChange={setPassword} /></label>
      <button disabled={busy} className="w-full rounded-lg bg-teal-700 py-2 font-semibold text-white hover:bg-teal-800 disabled:opacity-60">{busy ? "Memproses..." : "Masuk"}</button>
      <p className="text-sm text-slate-600">Belum punya akun? <Link className="font-semibold text-teal-700" to="/auth/register">Daftar</Link></p>
    </form>
  );
}
