const getSwal = async () => (await import("sweetalert2")).default;

export const showSuccessDialog = async (text) =>
  (await getSwal()).fire({ icon: "success", title: "Berhasil", text, confirmButtonColor: "#0f766e" });
export const showErrorDialog = async (text) =>
  (await getSwal()).fire({ icon: "error", title: "Gagal", text, confirmButtonColor: "#0f766e" });
export const showConfirmDialog = async (text) =>
  (await (await getSwal()).fire({ icon: "warning", title: "Yakin?", text, showCancelButton: true, confirmButtonText: "Ya", cancelButtonText: "Batal", confirmButtonColor: "#be123c" })).isConfirmed;

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

export const coverUrl = (path) => (path ? `${new URL(DELCOM_BASEURL).origin}/${path}` : null);

export const firstFieldError = (err) => {
  const f = err?.fields?.field ?? Object.values(err?.fields || {})[0];
  return Array.isArray(f) ? f[0] : err.message;
};
