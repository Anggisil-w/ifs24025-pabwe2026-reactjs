import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

import Swal from "sweetalert2";
import { apiFetch, getAccessToken, putAccessToken, removeAccessToken } from "../helpers/apiHelper";
import { coverUrl, firstFieldError, formatDate, showConfirmDialog, showErrorDialog, showSuccessDialog } from "../helpers/toolsHelper";
import { btnDanger, btnGhost, btnPrimary, card, inputCls } from "../helpers/uiClasses";
import useInput from "../hooks/useInput";

const jsonResponse = (body, status = 200) => ({ status, json: () => Promise.resolve(body) });

describe("apiHelper", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("stores, reads and removes the access token", () => {
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("sends a GET with params and bearer token", async () => {
    putAccessToken("tok");
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ success: true, data: {} }));
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/x", { params: { a: 1, b: "", c: undefined, d: null } });
    const [url, opts] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("a=1");
    expect(String(url)).not.toContain("b=");
    expect(opts.headers.Authorization).toBe("Bearer tok");
    expect(opts.method).toBe("GET");
  });

  it("skips the token when auth is false and sends a JSON body", async () => {
    putAccessToken("tok");
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ status: "success" }));
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/x", { method: "POST", body: { a: 1 }, auth: false });
    const opts = fetchMock.mock.calls[0][1];
    expect(opts.headers.Authorization).toBeUndefined();
    expect(opts.headers["Content-Type"]).toBe("application/json");
    expect(opts.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("passes FormData through untouched", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ success: true }));
    vi.stubGlobal("fetch", fetchMock);
    const form = new FormData();
    await apiFetch("/x", { method: "POST", form });
    expect(fetchMock.mock.calls[0][1].body).toBe(form);
  });

  it("throws with message, status and fields on failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ success: false, message: "Gagal", data: { f: 1 } }, 422)));
    await expect(apiFetch("/x")).rejects.toMatchObject({ message: "Gagal", status: 422, fields: { f: 1 } });
  });

  it("throws a default message when the body is not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 500, json: () => Promise.reject(new Error("bad")) }));
    await expect(apiFetch("/x")).rejects.toMatchObject({ message: "Terjadi kesalahan", status: 500 });
  });
});

describe("toolsHelper", () => {
  beforeEach(() => Swal.fire.mockReset());

  it("shows success and error dialogs", async () => {
    Swal.fire.mockResolvedValue({});
    await showSuccessDialog("ok");
    await showErrorDialog("bad");
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "success", text: "ok" }));
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error", text: "bad" }));
  });

  it("returns the confirmation result", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    expect(await showConfirmDialog("sure?")).toBe(true);
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("sure?")).toBe(false);
  });

  it("formats dates", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate("2026-01-15T00:00:00Z")).toMatch(/2026/);
  });

  it("builds cover urls", () => {
    expect(coverUrl(null)).toBeNull();
    expect(coverUrl("https://x.com/a.png")).toBe("https://x.com/a.png");
    expect(coverUrl("/img/a.png")).toMatch(/\/img\/a\.png$/);
  });

  it("extracts the first field error", () => {
    expect(firstFieldError({ fields: { field: ["wajib"] }, message: "m" })).toBe("wajib");
    expect(firstFieldError({ fields: { email: ["salah"] }, message: "m" })).toBe("salah");
    expect(firstFieldError({ message: "fallback" })).toBe("fallback");
  });
});

describe("uiClasses", () => {
  it("exports non-empty class strings", () => {
    [inputCls, btnPrimary, btnGhost, btnDanger, card].forEach((c) => expect(c.length).toBeGreaterThan(0));
  });
});

describe("useInput", () => {
  it("updates from events and raw values", () => {
    const { result } = renderHook(() => useInput("a"));
    expect(result.current[0]).toBe("a");
    act(() => result.current[1]({ target: { value: "b" } }));
    expect(result.current[0]).toBe("b");
    act(() => result.current[1]("c"));
    expect(result.current[0]).toBe("c");
    act(() => result.current[2]("d"));
    expect(result.current[0]).toBe("d");
  });

  it("defaults to an empty string", () => {
    const { result } = renderHook(() => useInput());
    expect(result.current[0]).toBe("");
  });
});
