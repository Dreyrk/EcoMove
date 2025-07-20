import request from "supertest";
import app from "../index";
import { ActivityType, UserRoleType } from "@prisma/client";
import authMiddleware from "../middlewares/auth.middleware";
import formatDateFr from "../utils/formatDateFr";
import userService from "../services/user.service";

// --- NOUVEAU MOCK POUR activity.service.ts ---
// Il faut mocker le module entier et simuler son "default export"
// en tant qu'objet avec les fonctions mockées.
jest.mock("../services/activity.service", () => ({
  __esModule: true,
  default: {
    createActivity: jest.fn(),
    getAllActivities: jest.fn(),
    getActivitiesByUserId: jest.fn(),
    getActivityById: jest.fn(), // Ajout de getActivityById ici !
    deleteActivity: jest.fn(),
  },
}));

// Récupérer le mock de activityService pour faciliter l'accès
import activityService from "../services/activity.service";

// Mock de PrismaClient (inchangé, mais je le remets pour le contexte)
jest.mock("../lib/db", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
    activity: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb()), // Simule une transaction en exécutant le callback
  },
}));

// Mock du middleware d'authentification
jest.mock("../middlewares/auth.middleware", () => ({
  __esModule: true,
  default: {
    verifyToken: jest.fn((req, res, next) => {
      req.user = { id: 1, email: "test@example.com", role: UserRoleType.ADMIN };
      next();
    }),
    restrictToAdmin: jest.fn((req, res, next) => {
      if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    }),
  },
}));

// Mock de userService
jest.mock("../services/user.service", () => ({
  __esModule: true,
  default: {
    getUserById: jest.fn(),
  },
}));

// Mock de getPagination
jest.mock("../utils/pagination", () => ({
  __esModule: true,
  getPagination: jest.fn(() => ({
    skip: 0,
    take: 10,
    page: 1,
    per_page: 10,
  })),
}));

// Mock de formatDateFr
jest.mock("../utils/formatDateFr", () => ({
  __esModule: true,
  default: jest.fn(), // Initialise juste un mock, la logique sera dans beforeEach
}));

describe("Activity Endpoints Minimal Tests", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Réinitialise le mock de verifyToken à son comportement par défaut (utilisateur valide)
    (authMiddleware.verifyToken as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { id: 1, email: "test@example.com", role: UserRoleType.USER };
      next();
    });
    // Réinitialise le mock de formatDateFr pour qu'il renvoie la date du jour du test
    const today = new Date();
    (formatDateFr as jest.Mock).mockReturnValue(
      `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}/${today.getFullYear()}`
    );
  });

  // --- Test pour POST /api/activities/new ---
  describe("POST /api/activities/new", () => {
    it("devrait créer une nouvelle activité, retourner 201", async () => {
      const todayFormatted = (formatDateFr as jest.Mock)();

      const activityData = {
        userId: 1,
        date: todayFormatted,
        type: ActivityType.MARCHE,
        steps: 3000,
        distanceKm: 0,
      };
      const expectedDistance = 2.0;

      // Mocks pour le service et Prisma
      (require("../lib/db").default.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: "Test User" });
      (require("../lib/db").default.activity.findUnique as jest.Mock).mockResolvedValue(null);
      (require("../lib/db").default.activity.create as jest.Mock).mockResolvedValue({
        id: 102,
        userId: activityData.userId,
        date: new Date(),
        type: activityData.type,
        steps: activityData.steps,
        distanceKm: expectedDistance,
      });
      // Mocke la méthode du service directement
      (activityService.createActivity as jest.Mock).mockResolvedValue({
        id: 102,
        userId: activityData.userId,
        date: new Date(),
        type: activityData.type,
        steps: activityData.steps,
        distanceKm: expectedDistance,
      });

      const res = await request(app).post("/api/activities/new").send(activityData);

      expect(res.statusCode).toEqual(201);
    });

    it("devrait retourner 400 si les données d'entrée sont invalides (ex: date invalide)", async () => {
      const activityData = {
        userId: 1,
        date: "32/13/2023",
        type: ActivityType.MARCHE,
        distanceKm: 5.0,
      };

      // Le contrôleur utilise Zod pour la validation. Pas besoin de mocker le service ici,
      // la validation se fait avant l'appel au service.

      const res = await request(app).post("/api/activities/new").send(activityData);

      expect(res.statusCode).toEqual(400);
    });
  });

  // --- Test pour GET /api/activities ---
  describe("GET /api/activities", () => {
    it("devrait récupérer toutes les activités avec pagination et retourner 200", async () => {
      const mockActivities = [
        {
          id: 1,
          userId: 1,
          date: new Date(),
          type: ActivityType.MARCHE,
          distanceKm: 5.0,
          steps: null,
          user: { id: 1, name: "User A", teamId: 1 },
        },
        {
          id: 2,
          userId: 2,
          date: new Date(),
          type: ActivityType.MARCHE,
          distanceKm: 2.5,
          steps: 3750,
          user: { id: 2, name: "User B", teamId: 1 },
        },
      ];

      // Mocke la méthode du service directement
      (activityService.getAllActivities as jest.Mock).mockResolvedValue({
        data: mockActivities,
        meta: { total: 2, skip: 0, take: 10, page: 1, per_page: 10 },
      });

      const res = await request(app).get("/api/activities");

      expect(res.statusCode).toEqual(200);
    });
  });

  // --- Test pour GET /api/activities/user/:userId ---
  describe("GET /api/activities/user/:userId", () => {
    it("devrait récupérer les activités d'un utilisateur spécifique et retourner 200", async () => {
      const userId = 1;
      const mockUserActivities = [
        { id: 1, userId: 1, date: new Date(), type: ActivityType.MARCHE, distanceKm: 5.0, steps: null },
      ];

      // Mocks pour userService et activityService
      (userService.getUserById as jest.Mock).mockResolvedValue({ id: userId, name: "Test User" });
      (activityService.getActivitiesByUserId as jest.Mock).mockResolvedValue({
        data: mockUserActivities,
        meta: { total: 1, skip: 0, take: 10, page: 1, per_page: 10 },
      });

      const res = await request(app).get(`/api/activities/user/${userId}`);

      expect(res.statusCode).toEqual(200);
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
    });

    it("devrait retourner 403 si l'utilisateur non-admin tente d'accéder aux activités d'un autre utilisateur", async () => {
      const requestedUserId = 2;

      const res = await request(app).get(`/api/activities/user/${requestedUserId}`);

      expect(res.statusCode).toEqual(403);
    });
  });

  // --- Test pour DELETE /api/activities/:id ---
  describe("DELETE /api/activities/:id", () => {
    it("devrait supprimer une activité et retourner 200", async () => {
      const activityIdToDelete = 1;
      const mockActivity = {
        id: activityIdToDelete,
        userId: 1,
        date: new Date(),
        type: ActivityType.MARCHE,
        distanceKm: 5.0,
        steps: null,
      };

      // Mocke la méthode du service directement
      (activityService.getActivityById as jest.Mock).mockResolvedValue(mockActivity);
      (activityService.deleteActivity as jest.Mock).mockResolvedValue(undefined); // deleteActivity ne retourne rien

      const res = await request(app).delete(`/api/activities/${activityIdToDelete}`);

      expect(res.statusCode).toEqual(200);
      expect(activityService.getActivityById).toHaveBeenCalledWith(activityIdToDelete);
      expect(activityService.deleteActivity).toHaveBeenCalledWith(activityIdToDelete);
    });

    it("devrait retourner 403 si l'utilisateur non-admin tente de supprimer l'activité d'un autre utilisateur", async () => {
      const activityIdToDelete = 2;
      const mockActivityOfOtherUser = {
        id: activityIdToDelete,
        userId: 2,
        date: new Date(),
        type: ActivityType.MARCHE,
        distanceKm: 5.0,
        steps: null,
      };

      (activityService.getActivityById as jest.Mock).mockResolvedValue(mockActivityOfOtherUser);

      const res = await request(app).delete(`/api/activities/${activityIdToDelete}`);

      expect(res.statusCode).toEqual(403);
    });

    it("devrait retourner 404 si l'activité à supprimer n'est pas trouvée", async () => {
      const activityIdToDelete = 999;

      (activityService.getActivityById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).delete(`/api/activities/${activityIdToDelete}`);

      expect(res.statusCode).toEqual(404);
    });
  });
});
