import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../helpers/apiHelper", () => ({ apiFetch: vi.fn().mockResolvedValue({}) }));

import { apiFetch } from "../helpers/apiHelper";
import { loginApi, registerApi, logoutApi } from "../features/auth/api/authApi";
import * as lf from "../features/lost-founds/api/lostFoundApi";
import { getUsers, getMe } from "../features/users/api/userApi";

beforeEach(() => apiFetch.mockClear());

describe("api wrappers", () => {
  it("auth endpoints", async () => {
    await loginApi({ a: 1 });
    await registerApi({ a: 1 });
    await logoutApi();
    expect(apiFetch).toHaveBeenCalledWith("/auth/login", { method: "POST", body: { a: 1 }, auth: false });
    expect(apiFetch).toHaveBeenCalledWith("/auth/register", { method: "POST", body: { a: 1 }, auth: false });
    expect(apiFetch).toHaveBeenCalledWith("/auth/logout", { method: "POST" });
  });

  it("lost-found endpoints", async () => {
    await lf.getLostFounds({ q: 1 });
    await lf.getLostFound(5);
    await lf.addLostFound({ t: 1 });
    await lf.changeLostFound(5, { t: 2 });
    await lf.deleteLostFound(5);
    await lf.getStatsDaily();
    await lf.getStatsMonthly();
    await lf.changeCover(5, new File(["x"], "a.png"));
    const paths = apiFetch.mock.calls.map((c) => c[0]);
    expect(paths).toEqual(["/lost-founds", "/lost-founds/5", "/lost-founds", "/lost-founds/5", "/lost-founds/5", "/lost-founds/stats/daily", "/lost-founds/stats/monthly", "/lost-founds/5/cover"]);
    expect(apiFetch.mock.calls[7][1].form).toBeInstanceOf(FormData);
  });

  it("user endpoints", async () => {
    await getUsers();
    await getMe();
    expect(apiFetch.mock.calls.map((c) => c[0])).toEqual(["/users", "/users/me"]);
  });
});
