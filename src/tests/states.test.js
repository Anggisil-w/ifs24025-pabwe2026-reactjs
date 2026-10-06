import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../features/auth/api/authApi", () => ({ loginApi: vi.fn(), registerApi: vi.fn(), logoutApi: vi.fn() }));
vi.mock("../features/lost-founds/api/lostFoundApi", () => ({
  getLostFounds: vi.fn(), getLostFound: vi.fn(), addLostFound: vi.fn(), changeLostFound: vi.fn(), changeCover: vi.fn(), deleteLostFound: vi.fn(),
}));
vi.mock("../features/users/api/userApi", () => ({ getUsers: vi.fn(), getMe: vi.fn() }));
vi.mock("../helpers/toolsHelper", async (orig) => ({
  ...(await orig()),
  showErrorDialog: vi.fn(), showSuccessDialog: vi.fn().mockResolvedValue(), showConfirmDialog: vi.fn(),
}));

import { loginApi, registerApi, logoutApi } from "../features/auth/api/authApi";
import * as lfApi from "../features/lost-founds/api/lostFoundApi";
import { getUsers, getMe } from "../features/users/api/userApi";
import { showErrorDialog, showConfirmDialog } from "../helpers/toolsHelper";
import authReducer, { isAuthLogin, isAuthLogout, isAuthRegister, setProfile } from "../features/auth/states/reducer";
import { asyncLogin, asyncRegister, asyncLogout } from "../features/auth/states/action";
import lfReducer, { lostFounds, lostFound, isLostFound } from "../features/lost-founds/states/reducer";
import { asyncGetLostFounds, asyncGetLostFound, asyncAddLostFound, asyncChangeLostFound, asyncChangeCover, asyncDeleteLostFound } from "../features/lost-founds/states/action";
import usersReducer, { users } from "../features/users/states/reducer";
import { asyncGetUsers, asyncGetProfile } from "../features/users/states/action";

const dispatch = vi.fn();
beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); });

describe("reducers", () => {
  it("auth reducer", () => {
    let s = authReducer(undefined, { type: "x" });
    expect(s.user).toBeNull();
    s = authReducer(s, isAuthLogin({ token: "t", user: { id: 1 } }));
    expect(s).toMatchObject({ token: "t", user: { id: 1 } });
    s = authReducer(s, isAuthLogin({ token: "t2" }));
    expect(s.user).toEqual({ id: 1 });
    s = authReducer(s, isAuthRegister());
    s = authReducer(s, setProfile({ id: 2 }));
    expect(s.user).toEqual({ id: 2 });
    s = authReducer(s, isAuthLogout());
    expect(s).toEqual({ token: null, user: null });
  });

  it("lost founds reducer", () => {
    let s = lfReducer(undefined, { type: "x" });
    s = lfReducer(s, lostFounds([{ id: 1 }]));
    s = lfReducer(s, lostFound({ id: 1 }));
    s = lfReducer(s, isLostFound(true));
    expect(s).toEqual({ lostFounds: [{ id: 1 }], lostFound: { id: 1 }, isLostFound: true });
  });

  it("users reducer", () => {
    expect(usersReducer(undefined, users([{ id: 1 }])).users).toEqual([{ id: 1 }]);
  });
});

describe("auth actions", () => {
  it("login success stores the token", async () => {
    loginApi.mockResolvedValue({ data: { token: "tok", user: { id: 1 } } });
    expect(await asyncLogin({})(dispatch)).toBe(true);
    expect(localStorage.getItem("accessToken")).toBe("tok");
    expect(dispatch).toHaveBeenCalled();
  });

  it("login accepts alternative token keys", async () => {
    loginApi.mockResolvedValue({ data: { access_token: "a" } });
    expect(await asyncLogin({})(dispatch)).toBe(true);
    loginApi.mockResolvedValue({ data: { accessToken: "b" } });
    expect(await asyncLogin({})(dispatch)).toBe(true);
  });

  it("login fails without a token", async () => {
    loginApi.mockResolvedValue({});
    expect(await asyncLogin({})(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalled();
  });

  it("login fails on API error", async () => {
    loginApi.mockRejectedValue(new Error("nope"));
    expect(await asyncLogin({})(dispatch)).toBe(false);
  });

  it("register success and failure", async () => {
    registerApi.mockResolvedValue({});
    expect(await asyncRegister({})(dispatch)).toBe(true);
    registerApi.mockRejectedValue(new Error("x"));
    expect(await asyncRegister({})(dispatch)).toBe(false);
  });

  it("logout clears the token even if the API fails", async () => {
    localStorage.setItem("accessToken", "t");
    logoutApi.mockRejectedValue(new Error("expired"));
    await asyncLogout()(dispatch);
    expect(localStorage.getItem("accessToken")).toBeNull();
    logoutApi.mockResolvedValue({});
    await asyncLogout()(dispatch);
  });
});

describe("lost-found actions", () => {
  it("fetches the list", async () => {
    lfApi.getLostFounds.mockResolvedValue({ data: { lost_founds: [{ id: 1 }] } });
    await asyncGetLostFounds({})(dispatch);
    expect(dispatch).toHaveBeenCalledTimes(3);
  });

  it("shows an error when the list fails", async () => {
    lfApi.getLostFounds.mockRejectedValue(new Error("bad"));
    await asyncGetLostFounds({})(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("bad");
  });

  it("fetches one item", async () => {
    lfApi.getLostFound.mockResolvedValue({ data: { lost_found: { id: 1 } } });
    expect(await asyncGetLostFound(1)(dispatch)).toBe(true);
    lfApi.getLostFound.mockRejectedValue(new Error("x"));
    expect(await asyncGetLostFound(1)(dispatch)).toBe(false);
  });

  it("mutations return true on success and false on error", async () => {
    lfApi.addLostFound.mockResolvedValue({});
    lfApi.changeLostFound.mockResolvedValue({});
    lfApi.changeCover.mockResolvedValue({});
    expect(await asyncAddLostFound({})()).toBe(true);
    expect(await asyncChangeLostFound(1, {})()).toBe(true);
    expect(await asyncChangeCover(1, {})()).toBe(true);
    lfApi.addLostFound.mockRejectedValue(new Error("x"));
    expect(await asyncAddLostFound({})()).toBe(false);
  });

  it("delete respects the confirmation", async () => {
    showConfirmDialog.mockResolvedValue(false);
    expect(await asyncDeleteLostFound(1)()).toBe(false);
    showConfirmDialog.mockResolvedValue(true);
    lfApi.deleteLostFound.mockResolvedValue({});
    expect(await asyncDeleteLostFound(1)()).toBe(true);
  });
});

describe("user actions", () => {
  it("loads users", async () => {
    getUsers.mockResolvedValue({ data: { users: [{ id: 1 }] } });
    await asyncGetUsers()(dispatch);
    getUsers.mockResolvedValue({ data: {} });
    await asyncGetUsers()(dispatch);
    getUsers.mockRejectedValue(new Error("x"));
    await asyncGetUsers()(dispatch);
    expect(showErrorDialog).toHaveBeenCalledWith("x");
  });

  it("loads the profile and detects 401", async () => {
    getMe.mockResolvedValue({ data: { user: { id: 1 } } });
    expect(await asyncGetProfile()(dispatch)).toBe(true);
    getMe.mockResolvedValue({ data: { id: 1 } });
    expect(await asyncGetProfile()(dispatch)).toBe(true);
    getMe.mockRejectedValue(Object.assign(new Error("x"), { status: 401 }));
    expect(await asyncGetProfile()(dispatch)).toBe(false);
    getMe.mockRejectedValue(new Error("net"));
    expect(await asyncGetProfile()(dispatch)).toBe(true);
  });
});
