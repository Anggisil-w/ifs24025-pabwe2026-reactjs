import store from "./store";

it("menggabungkan slice auth, users, dan lostFounds", () => {
  expect(Object.keys(store.getState())).toEqual(["auth", "users", "lostFounds"]);
});
