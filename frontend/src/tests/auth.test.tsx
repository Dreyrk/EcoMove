import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "./test-utils";
import AuthPage from "@/app/login/page";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState } from "react";

// Mock des dépendances externes
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
  },
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

describe("AuthPage", () => {
  beforeEach(() => {
    useActionState.mockImplementation((action, initialState) => {
      return [initialState, action, false];
    });
  });

  it("renders the login form by default", () => {
    render(<AuthPage />);
    expect(screen.getByText("Connexion")).toBeInTheDocument();
  });
});
