import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import auth from "./features/auth/states/reducer";
import users from "./features/users/states/reducer";
import lostFounds from "./features/lost-founds/states/reducer";

export function renderWithProviders(ui, { route = "/", preloadedState } = {}) {
  const store = configureStore({ reducer: { auth, users, lostFounds }, preloadedState });
  return { store, ...render(<Provider store={store}><MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter></Provider>) };
}
