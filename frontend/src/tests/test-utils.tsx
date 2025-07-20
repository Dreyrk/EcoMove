import React from "react";
import { render } from "@testing-library/react";
import { AuthProvider } from "@/components/providers/auth-provider";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

const customRender = (ui: React.ReactElement, options = {}) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
