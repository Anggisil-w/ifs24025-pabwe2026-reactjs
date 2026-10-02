// SweetAlert2 dimuat hanya saat dialog pertama kali dibutuhkan (mengurangi unused JavaScript).
const fire = async (options) => {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire(options);
};

export const showSuccessDialog = (text) => fire({ icon: "success", title: "Berhasil", text, confirmButtonColor: "#0f766e" });
export const showErrorDialog = (text) => fire({ icon: "error", title: "Gagal", text, confirmButtonColor: "#0f766e" });
export const showConfirmDialog = async (text) =>
  (await fire({ icon: "warning", title: "Yakin?", text, showCancelButton: true, confirmButtonText: "Ya", cancelButtonText: "Batal", confirmButtonColor: "#be123c" })).isConfirmed;

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

export const coverUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${new URL(DELCOM_BASEURL).origin}/${String(path).replace(/^\/+/, "")}`;
};

export const firstFieldError = (err) => {
  const f = err?.fields?.field ?? Object.values(err?.fields || {})[0];
  return Array.isArray(f) ? f[0] : err.message;
};