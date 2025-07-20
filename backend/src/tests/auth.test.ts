import request from "supertest";
import app from "../index";
import { UserRoleType } from "@prisma/client";

// Mock des dépendances essentielles pour les tests d'intégration
// Cela évite d'interagir avec une vraie base de données ou de générer de vrais tokens.
jest.mock("bcrypt", () => ({
  hash: jest.fn(() => Promise.resolve("hashedPassword123")),
  compare: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mockJwtToken"),
}));

jest.mock("../services/user.service", () => ({
  __esModule: true,
  default: {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
  },
}));

jest.mock("../utils/env", () => ({
  getJwtSecret: jest.fn(() => "test_jwt_secret"),
}));

// Optionnel: Si tu veux masquer les logs de console.error pendant les tests
let consoleErrorSpy: jest.SpyInstance;

describe("Auth Endpoints Minimal Tests", () => {
  beforeAll(() => {
    // Masque les logs de console.error pour une sortie de test plus propre
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    // Restaure le comportement original de console.error
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    // Réinitialise les mocks avant chaque test
    jest.clearAllMocks();
  });

  // --- Test pour POST /api/auth/register ---
  describe("POST /api/auth/register", () => {
    it("devrait enregistrer un nouvel utilisateur et retourner 201", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        teamId: 1,
      };

      // Configuration du mock pour userService.createUser
      // Il doit retourner la version de l'utilisateur sans mot de passe
      (require("../services/user.service").default.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        name: userData.name,
        email: userData.email,
        teamId: userData.teamId,
        role: UserRoleType.USER,
      });

      const res = await request(app).post("/api/auth/register").send(userData);

      // Assertions minimales
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty("email", userData.email);
    });
  });

  // --- Test pour POST /api/auth/login ---
  describe("POST /api/auth/login", () => {
    it("devrait connecter un utilisateur et retourner 200 avec un token", async () => {
      const userCredentials = {
        email: "existing@example.com",
        password: "correctpassword",
      };

      // Configuration du mock pour userService.getUserByEmail
      // Il doit retourner un utilisateur avec le mot de passe haché
      (require("../services/user.service").default.getUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Existing User",
        email: userCredentials.email,
        password: "hashedCorrectPassword",
        role: UserRoleType.USER,
        teamId: 1,
      });

      const res = await request(app).post("/api/auth/login").send(userCredentials);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("user");
      expect(res.headers["set-cookie"][0]).toContain("token="); // Vérifie qu'un cookie 'token' est envoyé
    });
  });
});
