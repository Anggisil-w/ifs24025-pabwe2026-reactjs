import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthLayout() {
  const token = useSelector((s) => s.auth.token);
  if (token) return <Navigate to="/" replace />;
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <section className="hidden lg:flex flex-col justify-end bg-teal-800 text-teal-50 p-12">
        <p className="text-5xl font-extrabold leading-tight">Barangmu hilang?<br />Atau kamu menemukannya?</p>
        <p className="mt-4 max-w-md text-teal-100">Catat laporan, tambahkan foto, dan pantau sampai barang kembali ke pemiliknya.</p>
      </section>
      <section className="flex items-center justify-center p-6"><div className="w-full max-w-sm"><Outlet /></div></section>
    </main>
  );
}
