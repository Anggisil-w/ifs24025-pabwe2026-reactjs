import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";

vi.mock("../helpers/apiHelper", async (orig) => ({ ...(await orig()), apiFetch: vi.fn() }));
vi.mock("sweetalert2", () => ({ default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) } }));

import { apiFetch } from "../helpers/apiHelper";
import Swal from "sweetalert2";
import App from "../App";
import { renderWithProviders } from "../test-utils";
import Modal from "../features/lost-founds/modals/Modal";
import ReportForm from "../features/lost-founds/modals/ReportForm";
import ChangeCoverModal from "../features/lost-founds/modals/ChangeCoverModal";
import AddModal from "../features/lost-founds/modals/AddModal";
import ChangeModal from "../features/lost-founds/modals/ChangeModal";
import NavbarComponent from "../features/lost-founds/components/NavbarComponent";
import SidebarComponent from "../features/lost-founds/components/SidebarComponent";
import DetailPage from "../features/lost-founds/pages/DetailPage";
import ProfilePage from "../features/users/pages/ProfilePage";
import UsersPage from "../features/users/pages/UsersPage";

const me = { id: 1, name: "Budi", email: "b@x.com", created_at: "2026-01-01T00:00:00Z" };
const item = { id: 7, user_id: 1, title: "Dompet", description: "Hitam", status: "lost", is_completed: 0, cover: "/c.png", created_at: "2026-02-01T00:00:00Z", author: { name: "Budi" } };
const authed = { auth: { token: "t", user: me } };

// Rute API → respons, dipakai oleh apiFetch palsu.
const routeApi = (overrides = {}) => apiFetch.mockImplementation(async (path, opts = {}) => {
  const key = `${opts.method || "GET"} ${path}`;
  if (key in overrides) { const v = overrides[key]; if (v instanceof Error) throw v; return v; }
  if (path === "/users/me") return { data: { user: me } };
  if (path === "/users") return { data: { users: [{ id: 1, name: "Budi", email: "b@x.com" }, { id: 2, email: "z@x.com" }] } };
  if (path === "/lost-founds") return { data: { lost_founds: [item, { ...item, id: 8, title: "Kunci", description: "Besi", status: "found", is_completed: 1, cover: null }] } };
  if (path.startsWith("/lost-founds/")) return { data: { lost_found: item } };
  return { data: {} };
});

beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); routeApi(); Swal.fire.mockResolvedValue({ isConfirmed: true }); });

describe("Login & Register pages", () => {
  it("warns when login fields are empty", async () => {
    renderWithProviders(<App />, { route: "/auth/login" });
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error" })));
  });

  it("logs in and lands on the home page", async () => {
    routeApi({ "POST /auth/login": { data: { token: "tok", user: me } } });
    renderWithProviders(<App />, { route: "/auth/login" });
    await userEvent.type(document.getElementById("login-email-input"), "b@x.com");
    await userEvent.type(document.getElementById("login-password-input"), "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(await screen.findByRole("heading", { name: "Laporan" })).toBeInTheDocument();
  });

  it("stays on login when credentials are rejected", async () => {
    routeApi({ "POST /auth/login": new Error("salah") });
    renderWithProviders(<App />, { route: "/auth/login" });
    await userEvent.type(document.getElementById("login-email-input"), "b@x.com");
    await userEvent.type(document.getElementById("login-password-input"), "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    expect(screen.getByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("validates the register form", async () => {
    renderWithProviders(<App />, { route: "/auth/register" });
    await userEvent.type(document.getElementById("register-name-input"), "Budi");
    await userEvent.type(document.getElementById("register-email-input"), "b@x.com");
    await userEvent.type(document.getElementById("register-password-input"), "123");
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error" })));
    expect(apiFetch).not.toHaveBeenCalledWith("/auth/register", expect.anything());
  });

  it("registers and goes to login", async () => {
    renderWithProviders(<App />, { route: "/auth/register" });
    await userEvent.type(document.getElementById("register-name-input"), "Budi");
    await userEvent.type(document.getElementById("register-email-input"), "b@x.com");
    await userEvent.type(document.getElementById("register-password-input"), "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("redirects /auth to login and authenticated users away from auth pages", async () => {
    renderWithProviders(<App />, { route: "/auth" });
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("redirects a logged-in user from /auth/login to home", async () => {
    renderWithProviders(<App />, { route: "/auth/login", preloadedState: authed });
    expect(await screen.findByRole("heading", { name: "Laporan" })).toBeInTheDocument();
  });
});

describe("Home page", () => {
  it("lists reports, stats and filters", async () => {
    renderWithProviders(<App />, { route: "/", preloadedState: authed });
    expect(await screen.findByText("Dompet")).toBeInTheDocument();
    expect(screen.getByText("Kunci")).toBeInTheDocument();
    expect(screen.getByText("Selesai", { selector: "span" })).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Cari judul atau deskripsi"), "kunci");
    await waitFor(() => expect(screen.queryByText("Dompet")).not.toBeInTheDocument());

    await userEvent.selectOptions(screen.getByLabelText("Filter jenis laporan"), "lost");
    await userEvent.selectOptions(screen.getByLabelText("Filter status laporan"), "1");
    await userEvent.click(screen.getByLabelText("Laporan saya"));
    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith("/lost-founds", { params: { status: "lost", is_completed: "1", is_me: 1 } }));
  });

  it("shows the empty state", async () => {
    routeApi({ "GET /lost-founds": { data: { lost_founds: [] } } });
    renderWithProviders(<App />, { route: "/", preloadedState: authed });
    expect(await screen.findByText(/Belum ada laporan/)).toBeInTheDocument();
  });

  it("falls back to a placeholder when a cover image breaks", async () => {
    renderWithProviders(<App />, { route: "/", preloadedState: authed });
    const img = await screen.findByAltText("Foto Dompet");
    fireEvent.error(img);
    await waitFor(() => expect(screen.queryByAltText("Foto Dompet")).not.toBeInTheDocument());
  });

  it("adds a report through the modal", async () => {
    renderWithProviders(<App />, { route: "/", preloadedState: authed });
    await userEvent.click(await screen.findByRole("button", { name: /Tambah laporan/ }));
    await userEvent.type(document.getElementById("report-title"), "Tas");
    await userEvent.type(document.getElementById("report-description"), "Biru");
    await userEvent.click(screen.getByRole("button", { name: "Simpan laporan" }));
    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith("/lost-founds", expect.objectContaining({ method: "POST" })));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes the add modal with the close button", async () => {
    renderWithProviders(<App />, { route: "/", preloadedState: authed });
    await userEvent.click(await screen.findByRole("button", { name: /Tambah laporan/ }));
    await userEvent.click(screen.getByLabelText("Tutup"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows an error dialog when loading fails", async () => {
    routeApi({ "GET /lost-founds": new Error("down") });
    renderWithProviders(<App />, { route: "/", preloadedState: authed });
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ text: "down" })));
  });
});

describe("Layout", () => {
  it("logs out from the navbar", async () => {
    renderWithProviders(<App />, { route: "/", preloadedState: authed });
    await userEvent.click(await screen.findByRole("button", { name: /Keluar/ }));
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("logs out automatically when the profile request returns 401", async () => {
    routeApi({ "GET /users/me": Object.assign(new Error("unauth"), { status: 401 }) });
    renderWithProviders(<App />, { route: "/", preloadedState: { auth: { token: "t", user: null } } });
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("renders navbar without a name and the sidebar links", () => {
    const onLogout = vi.fn();
    renderWithProviders(<><NavbarComponent onLogout={onLogout} /><SidebarComponent /></>);
    fireEvent.click(screen.getByRole("button", { name: /Keluar/ }));
    expect(onLogout).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: /Profil saya/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Pengguna/ })).toBeInTheDocument();
  });

  it("shows the initial in the navbar", () => {
    renderWithProviders(<NavbarComponent name="budi" onLogout={() => {}} />);
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});

describe("Users & Profile pages", () => {
  it("lists users", async () => {
    renderWithProviders(<UsersPage />);
    expect(await screen.findByText("b@x.com", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("z@x.com")).toBeInTheDocument();
  });

  it("shows the empty users state", async () => {
    routeApi({ "GET /users": { data: { users: [] } } });
    renderWithProviders(<UsersPage />);
    expect(await screen.findByText("Belum ada data pengguna.")).toBeInTheDocument();
  });

  it("shows the profile or a loading state", () => {
    const { unmount } = renderWithProviders(<ProfilePage />);
    expect(screen.getByText("Memuat profil...")).toBeInTheDocument();
    unmount();
    renderWithProviders(<ProfilePage />, { preloadedState: authed });
    expect(screen.getByRole("heading", { name: "Budi" })).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("renders the profile page and users page via routes", async () => {
    renderWithProviders(<App />, { route: "/profile", preloadedState: authed });
    expect(await screen.findByText(/Bergabung/)).toBeInTheDocument();
  });

  it("renders the users route lazily", async () => {
    renderWithProviders(<App />, { route: "/users", preloadedState: authed });
    expect(await screen.findByRole("heading", { name: "Pengguna" })).toBeInTheDocument();
  });
});

const renderDetail = (state = authed) => renderWithProviders(
  <Routes><Route path="/lost-founds/:id" element={<DetailPage />} /><Route path="/" element={<p>Beranda</p>} /></Routes>,
  { route: "/lost-founds/7", preloadedState: state },
);

describe("Detail page", () => {
  it("shows the report with owner actions", async () => {
    renderDetail();
    expect(await screen.findByRole("heading", { name: "Dompet" })).toBeInTheDocument();
    expect(screen.getByText("Dalam proses")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Hapus/ })).toBeInTheDocument();
  });

  it("hides owner actions for other users and handles a broken image", async () => {
    renderDetail({ auth: { token: "t", user: { ...me, id: 99 } } });
    const img = await screen.findByAltText("Dompet");
    expect(screen.queryByRole("button", { name: /Hapus/ })).not.toBeInTheDocument();
    fireEvent.error(img);
    expect(await screen.findByText("Belum ada foto")).toBeInTheDocument();
  });

  it("shows completed state", async () => {
    routeApi({ "GET /lost-founds/7": { data: { lost_found: { ...item, is_completed: 1, cover: null } } } });
    renderDetail();
    expect(await screen.findByText("Selesai")).toBeInTheDocument();
  });

  it("shows a not-found message", async () => {
    routeApi({ "GET /lost-founds/7": new Error("404") });
    renderDetail();
    expect(await screen.findByRole("heading", { name: "Laporan tidak ditemukan" })).toBeInTheDocument();
  });

  it("deletes a report and returns home", async () => {
    renderDetail();
    await userEvent.click(await screen.findByRole("button", { name: /Hapus/ }));
    expect(await screen.findByText("Beranda")).toBeInTheDocument();
  });

  it("ignores a late response after unmount, hides owner actions without a user and tolerates a missing author", async () => {
    routeApi({ "GET /lost-founds/7": { data: { lost_found: { ...item, author: undefined } } } });
    renderDetail({ auth: { token: "t", user: null } });
    expect(await screen.findByRole("heading", { name: "Dompet" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Hapus/ })).not.toBeInTheDocument();
  });

  it("does not update state when unmounted before the report loads", async () => {
    let resolve;
    apiFetch.mockImplementation(() => new Promise((r) => { resolve = r; }));
    const { unmount } = renderDetail();
    unmount();
    resolve({ data: { lost_found: item } });
    await Promise.resolve();
    expect(apiFetch).toHaveBeenCalled();
  });

  it("stays on the page when delete is cancelled", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: false });
    renderDetail();
    await userEvent.click(await screen.findByRole("button", { name: /Hapus/ }));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    expect(screen.queryByText("Beranda")).not.toBeInTheDocument();
  });

  it("edits a report", async () => {
    renderDetail();
    await userEvent.click(await screen.findByRole("button", { name: /Ubah laporan/ }));
    await userEvent.click(document.getElementById("report-done"));
    await userEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith("/lost-founds/7", expect.objectContaining({ method: "PUT", body: expect.objectContaining({ is_completed: 1 }) })));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("shows the not-found message when reloading after an edit fails", async () => {
    let loads = 0;
    const base = apiFetch.getMockImplementation();
    apiFetch.mockImplementation(async (path, opts = {}) => {
      if (path === "/lost-founds/7" && (opts.method || "GET") === "GET" && ++loads > 1) throw new Error("404");
      return base(path, opts);
    });
    renderDetail();
    await userEvent.click(await screen.findByRole("button", { name: /Ubah laporan/ }));
    await userEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
    expect(await screen.findByRole("heading", { name: "Laporan tidak ditemukan" })).toBeInTheDocument();
  });

  it("changes the cover", async () => {
    URL.createObjectURL = vi.fn(() => "blob:x");
    URL.revokeObjectURL = vi.fn();
    renderDetail();
    await userEvent.click(await screen.findByRole("button", { name: /Ganti cover/ }));
    expect(screen.getByRole("button", { name: "Unggah cover" })).toBeDisabled();
    await userEvent.upload(screen.getByLabelText("Pilih foto cover"), new File(["x"], "a.png", { type: "image/png" }));
    expect(await screen.findByAltText("Pratinjau cover")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Unggah cover" }));
    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith("/lost-founds/7/cover", expect.objectContaining({ method: "POST" })));
  });
});

describe("Modal pieces", () => {
  it("renders Modal title and children", () => {
    renderWithProviders(<Modal title="Judul" onClose={() => {}}><p>isi</p></Modal>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("isi")).toBeInTheDocument();
  });

  it("ReportForm submits values and handles prefilled data", async () => {
    const onSubmit = vi.fn().mockResolvedValue();
    renderWithProviders(<ReportForm initial={{ title: "A", description: "B", status: "found", is_completed: 1 }} withCompleted submitLabel="Kirim" onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Kirim" }));
    expect(onSubmit).toHaveBeenCalledWith({ title: "A", description: "B", status: "found", is_completed: 1 });
  });

  it("ReportForm changes the type", async () => {
    const onSubmit = vi.fn().mockResolvedValue();
    renderWithProviders(<ReportForm submitLabel="Kirim" onSubmit={onSubmit} />);
    await userEvent.type(document.getElementById("report-title"), "T");
    await userEvent.type(document.getElementById("report-description"), "D");
    await userEvent.selectOptions(screen.getByLabelText("Jenis laporan"), "found");
    await userEvent.click(screen.getByRole("button", { name: "Kirim" }));
    expect(onSubmit).toHaveBeenCalledWith({ title: "T", description: "D", status: "found" });
  });

  it("ChangeCoverModal keeps the button disabled when the file is cleared", async () => {
    renderWithProviders(<ChangeCoverModal id={1} onClose={() => {}} onDone={() => {}} />);
    fireEvent.change(screen.getByLabelText("Pilih foto cover"), { target: { files: [] } });
    expect(screen.getByRole("button", { name: "Unggah cover" })).toBeDisabled();
  });

  it("keeps the add modal open when saving fails", async () => {
    routeApi({ "POST /lost-founds": new Error("gagal") });
    const onClose = vi.fn();
    const onDone = vi.fn();
    renderWithProviders(<AddModal onClose={onClose} onDone={onDone} />);
    await userEvent.type(document.getElementById("report-title"), "T");
    await userEvent.type(document.getElementById("report-description"), "D");
    await userEvent.click(screen.getByRole("button", { name: "Simpan laporan" }));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error" })));
    expect(onClose).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });

  it("keeps the change modal open when saving fails", async () => {
    routeApi({ "PUT /lost-founds/7": new Error("gagal") });
    const onClose = vi.fn();
    const onDone = vi.fn();
    renderWithProviders(<ChangeModal item={item} onClose={onClose} onDone={onDone} />);
    await userEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error" })));
    expect(onClose).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });

  it("keeps the cover modal open when upload fails", async () => {
    URL.createObjectURL = vi.fn(() => "blob:x");
    URL.revokeObjectURL = vi.fn();
    routeApi({ "POST /lost-founds/7/cover": new Error("gagal") });
    const onClose = vi.fn();
    const onDone = vi.fn();
    renderWithProviders(<ChangeCoverModal id={7} onClose={onClose} onDone={onDone} />);
    await userEvent.upload(screen.getByLabelText("Pilih foto cover"), new File(["x"], "a.png", { type: "image/png" }));
    await userEvent.click(screen.getByRole("button", { name: "Unggah cover" }));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error" })));
    expect(onClose).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });
});
