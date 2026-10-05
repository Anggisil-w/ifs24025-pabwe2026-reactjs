import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "./test-utils";

describe("App Component", () => {
  it("should render application without crashing", () => {
    const { container } = renderWithProviders(<App />, { route: "/auth/login" });
    expect(container).toBeDefined();
  });

  it("redirects unauthenticated users to the login page", async () => {
    renderWithProviders(<App />, { route: "/" });
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("redirects unknown routes to the login page when not authenticated", async () => {
    renderWithProviders(<App />, { route: "/random-invalid-route" });
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });
});